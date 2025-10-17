<script setup>
import { ref, defineProps, watch, computed, defineEmits, onMounted } from "vue";
import InputTransparent from "../inputs/InputTransparent.vue";
import enumOptions, {
  getEnumOptions as getEnumOptionsHelper,
} from "../../enums/enumOptions.js";
import { getApiBaseUrl } from "../../apiConfig.js";
import {
  CreditCardIcon,
  Cog6ToothIcon,
  DeviceTabletIcon,
  PrinterIcon,
  QrCodeIcon,
  GlobeAltIcon,
  CurrencyEuroIcon,
  ClockIcon,
  UserGroupIcon,
  TagIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  ServerStackIcon,
  IdentificationIcon,
  ListBulletIcon,
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'

const getEnumOptions = getEnumOptionsHelper;

const props = defineProps({
  show: Boolean,
  data: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  searchValue: {
    type: String,
    default: '',
  },
});

const localData = ref(JSON.parse(JSON.stringify(props.data)));
const schema = ref(null);
const dynamicEnums = ref({});
const enumsLoading = ref(false);

// Fetch schema and enums on component mount
onMounted(async () => {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const token = localStorage.getItem('jwt');
    enumsLoading.value = true;
    
    // Fetch schema and enums in parallel
    const [schemaResponse, enumsResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/eps-configuration/schema`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }),
      fetch(`${apiBaseUrl}/eps-configuration/enums`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
    ]);
    
    if (schemaResponse.ok) {
      schema.value = await schemaResponse.json();
      console.log('Schema loaded successfully:', schema.value);
    } else {
      console.error('Failed to fetch schema:', schemaResponse.status, schemaResponse.statusText);
    }
    
    if (enumsResponse.ok) {
      dynamicEnums.value = await enumsResponse.json();
      console.log('Enums loaded successfully:', dynamicEnums.value);
    } else {
      console.error('Failed to fetch enums:', enumsResponse.status, enumsResponse.statusText);
      // If enums endpoint doesn't exist yet, just log and continue
      console.info('Enums endpoint not available, using static enums only');
    }
  } catch (error) {
    console.error('Failed to fetch schema or enums:', error);
    console.info('Falling back to static enums only');
  } finally {
    enumsLoading.value = false;
  }
});

// Group properties into general and list sections
const transformedData = computed(() => {
  const general = {};
  const lists = {};
  for (const [key, value] of Object.entries(localData.value)) {
    if (Array.isArray(value)) {
      lists[key] = value;
    } else {
      general[key] = value;
    }
  }
  const result = {};
  if (Object.keys(general).length > 0) {
    result.General = general;
  }
  Object.assign(result, lists);
  return result;
});

const activeTab = ref("General");
const activeSubTab = ref(null);
// Collapsed state for array-based tabs
const collapsedTabs = ref(new Set());
// Toggle state for showing array properties in sub-tab view
const showArrayProperties = ref(false);

const emit = defineEmits(["update"]);

// Update collapsed tabs when transformedData changes
watch(transformedData, (newData) => {
  const arrayTabs = Object.keys(newData).filter(key => Array.isArray(newData[key]));
  collapsedTabs.value = new Set(arrayTabs);
}, { immediate: true });

watch(
  () => props.data,
  (newData) => {
    localData.value = JSON.parse(JSON.stringify(newData));
    const keys = Object.keys(transformedData.value);
    if (!keys.includes(activeTab.value)) {
      activeTab.value = keys.length ? keys[0] : "General";
    }
    activeSubTab.value = null;
  }
);

const filteredData = computed(() => {
  if (!props.searchValue.trim()) return transformedData.value;
  const result = {};
  const search = props.searchValue.toLowerCase();
  for (const [section, fields] of Object.entries(transformedData.value)) {
    if (section.toLowerCase().includes(search)) {
      result[section] = fields;
      continue;
    }
    if (Array.isArray(fields)) {
      // Search within array items
      const filteredItems = fields.filter(item => {
        if (typeof item === 'object' && item !== null) {
          return Object.entries(item).some(([key, value]) =>
            key.toLowerCase().includes(search) ||
            String(value).toLowerCase().includes(search)
          );
        }
        return String(item).toLowerCase().includes(search);
      });
      if (filteredItems.length > 0) {
        result[section] = filteredItems;
      }
    } else if (typeof fields === "object" && fields !== null) {
      // Search within general properties
      const filteredFields = Object.fromEntries(
        Object.entries(fields).filter(
          ([key, value]) =>
            key.toLowerCase().includes(search) ||
            String(value).toLowerCase().includes(search)
        )
      );
      if (Object.keys(filteredFields).length) {
        result[section] = filteredFields;
      }
    }
  }
  return result;
});

watch(filteredData, (newFiltered) => {
  const keys = Object.keys(newFiltered);
  if (!keys.includes(activeTab.value)) {
    activeTab.value = keys.length ? keys[0] : "";
    activeSubTab.value = null;
  }
});

function updateConfiguration() {
  emit("update", {
    config: localData.value,
  });
}

function formatLabel(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
}

// Enhanced function to get enum options - prioritizes dynamic enums over static ones
function getEnumOptionsForProperty(tab, prop) {
  // First try dynamic enums
  if (dynamicEnums.value && !enumsLoading.value) {
    // Check if there's a direct match for the property
    if (dynamicEnums.value[prop]) {
      return formatEnumOptions(dynamicEnums.value[prop]);
    }
    
    // Check if there's a tab-specific enum
    if (dynamicEnums.value[tab] && dynamicEnums.value[tab][prop]) {
      return formatEnumOptions(dynamicEnums.value[tab][prop]);
    }
    
    // Check with case-insensitive matching
    const tabKey = Object.keys(dynamicEnums.value).find(
      k => k.toLowerCase() === tab.toLowerCase()
    );
    if (tabKey && typeof dynamicEnums.value[tabKey] === "object" && dynamicEnums.value[tabKey][prop]) {
      return formatEnumOptions(dynamicEnums.value[tabKey][prop]);
    }
    
    // Check for partial property name matches (useful for common patterns)
    const enumKey = Object.keys(dynamicEnums.value).find(key => {
      // Try exact match first
      if (key === prop) return true;
      
      // Try case-insensitive match
      if (key.toLowerCase() === prop.toLowerCase()) return true;
      
      // Try partial matches for common patterns
      const keyLower = key.toLowerCase();
      const propLower = prop.toLowerCase();
      
      // Check if property name contains the enum key or vice versa
      if (keyLower.includes(propLower) || propLower.includes(keyLower)) return true;
      
      // Check for common suffixes/prefixes
      if (keyLower.endsWith('type') && propLower.includes('type')) return true;
      if (keyLower.endsWith('mode') && propLower.includes('mode')) return true;
      if (keyLower.endsWith('language') && propLower.includes('language')) return true;
      if (keyLower.endsWith('identifier') && propLower.includes('identifier')) return true;
      
      return false;
    });
    
    if (enumKey) {
      console.log(`Found enum match: ${prop} -> ${enumKey}`, dynamicEnums.value[enumKey]);
      return formatEnumOptions(dynamicEnums.value[enumKey]);
    }
  }
  
  // Fallback to static enums
  return getEnumOptions(tab, prop);
}

// Helper function to format enum options into the expected format
function formatEnumOptions(enumData) {
  if (!enumData) return null;
  
  // If it's already in the correct format { value, label }[]
  if (Array.isArray(enumData) && enumData.length > 0 && typeof enumData[0] === 'object' && 'value' in enumData[0] && 'label' in enumData[0]) {
    return enumData;
  }
  
  // Handle API format with { Value, Name } properties (from your backend)
  if (Array.isArray(enumData) && enumData.length > 0 && typeof enumData[0] === 'object' && 'Value' in enumData[0] && 'Name' in enumData[0]) {
    return enumData.map(item => ({ 
      value: item.Value, 
      label: item.Name 
    }));
  }
  
  // If it's an array of strings, convert to { value, label } format
  if (Array.isArray(enumData) && enumData.length > 0 && typeof enumData[0] === 'string') {
    return enumData.map((item, index) => ({ value: index, label: item }));
  }
  
  // If it's an object with key-value pairs, convert to { value, label } format
  if (typeof enumData === 'object' && !Array.isArray(enumData)) {
    return Object.entries(enumData).map(([key, value]) => ({ 
      value: isNaN(Number(key)) ? key : Number(key), 
      label: String(value) 
    }));
  }
  
  return null;
}

function toggleTabCollapse(tabKey) {
  const newCollapsed = new Set(collapsedTabs.value);
  if (newCollapsed.has(tabKey)) {
    newCollapsed.delete(tabKey);
  } else {
    newCollapsed.add(tabKey);
  }
  collapsedTabs.value = newCollapsed;
}

function selectMainTab(tabKey) {
  activeTab.value = tabKey;
  activeSubTab.value = null;
  // Reset array properties visibility when switching main tabs
  showArrayProperties.value = false;
}

function selectSubTab(tabKey, index) {
  activeTab.value = tabKey;
  activeSubTab.value = index;
  // Reset array properties visibility when switching tabs
  showArrayProperties.value = false;
}

function toggleArrayProperties() {
  showArrayProperties.value = !showArrayProperties.value;
}

const iconMap = {
  General: Cog6ToothIcon,
  RegisteredTerminals: DeviceTabletIcon,
  Acquirers: CreditCardIcon,
  Languages: GlobeAltIcon,
  Messages: QrCodeIcon,
  EpsClientConfiguration: QrCodeIcon,
  PinpadConfiguration: CreditCardIcon,
  FdcConfiguration: Cog6ToothIcon,
  DisplayConfiguration: DeviceTabletIcon,
  PrinterConfiguration: PrinterIcon,
  ViaVerdeConfiguration: GlobeAltIcon,
  RemoteServicesConfiguration: ServerStackIcon,
  GalpConfiguration: CurrencyEuroIcon,
  RegionalSettings: GlobeAltIcon,
  BnaConfiguration: BanknotesIcon,
  HeadOfficeConfiguration: BuildingStorefrontIcon,
  TimingsConfiguration: ClockIcon,
  LocalCreditConfiguration: UserGroupIcon,
  BankingCardPaymentConfiguration: CreditCardIcon,
  DiscountsConfiguration: TagIcon,
  PrioConfiguration: IdentificationIcon,
  IngenicoConfiguration: CreditCardIcon,
  IntermarcheConfiguration: BuildingStorefrontIcon,
  BongasConfiguration: GlobeAltIcon,
}

function nonBooleanFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => typeof v !== 'boolean' && !Array.isArray(v)));
}
function booleanFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => typeof v === 'boolean'));
}
function arrayFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => Array.isArray(v)));
}

// Function to create a new object based on schema
function createNewObjectFromSchema(schemaPath) {
  if (!schema.value) {
    console.warn('No schema available for creating object');
    return {};
  }
  
  try {
    console.log('Creating new object for schema path:', schemaPath);
    console.log('Available schema:', schema.value);
    
    // Check if this is a template object (not JSON Schema format)
    if (schema.value[schemaPath] && Array.isArray(schema.value[schemaPath])) {
      const arrayTemplate = schema.value[schemaPath];
      console.log('Found array template:', arrayTemplate);
      
      if (arrayTemplate.length > 0) {
        // Use the first item as a template
        const template = arrayTemplate[0];
        console.log('Using template:', template);
        
        // Create a full object based on the template structure
        const result = createObjectFromTemplate(template);
        console.log('Created object from template:', result);
        return result;
      }
    }
    
    // Try with camelCase conversion (RegisteredTerminals -> registeredTerminals)
    const camelCaseSchemaPath = schemaPath.charAt(0).toLowerCase() + schemaPath.slice(1);
    if (schema.value[camelCaseSchemaPath] && Array.isArray(schema.value[camelCaseSchemaPath])) {
      const arrayTemplate = schema.value[camelCaseSchemaPath];
      console.log('Found camelCase array template:', arrayTemplate);
      
      if (arrayTemplate.length > 0) {
        const template = arrayTemplate[0];
        console.log('Using camelCase template:', template);
        const result = createObjectFromTemplate(template);
        console.log('Created object from camelCase template:', result);
        return result;
      }
    }
    
    // If it's a JSON Schema format, handle it the old way
    let currentSchema = schema.value;
    
    // For array properties, we need to look at the items schema
    if (currentSchema.properties && currentSchema.properties[schemaPath]) {
      const arraySchema = currentSchema.properties[schemaPath];
      if (arraySchema.type === 'array' && arraySchema.items) {
        return createObjectFromSchema(arraySchema.items);
      }
    }
    
    // Try with camelCase for JSON Schema too
    if (currentSchema.properties && currentSchema.properties[camelCaseSchemaPath]) {
      const arraySchema = currentSchema.properties[camelCaseSchemaPath];
      if (arraySchema.type === 'array' && arraySchema.items) {
        return createObjectFromSchema(arraySchema.items);
      }
    }
    
    // If direct path doesn't work, try navigating through the schema
    const pathParts = schemaPath.split('.');
    for (const part of pathParts) {
      if (currentSchema.properties && currentSchema.properties[part]) {
        currentSchema = currentSchema.properties[part];
      } else if (currentSchema.items) {
        currentSchema = currentSchema.items;
      } else {
        console.warn(`Schema path not found: ${part} in ${schemaPath}`);
        break;
      }
    }
    
    // If we found array items schema, use it
    if (currentSchema.items) {
      return createObjectFromSchema(currentSchema.items);
    }
    
    return createObjectFromSchema(currentSchema);
  } catch (error) {
    console.error('Error creating object from schema:', error);
    return {};
  }
}

// Helper function to create object with default values based on schema
function createObjectFromSchema(schemaObj) {
  if (!schemaObj) {
    console.warn('No schema object provided');
    return {};
  }
  
  // Check if this is actually a template object (not a JSON Schema)
  // If it has properties that are not JSON Schema properties, treat it as a template
  if (typeof schemaObj === 'object' && !schemaObj.type && !schemaObj.properties && !schemaObj.items) {
    console.log('Schema object appears to be a template, using createObjectFromTemplate');
    return createObjectFromTemplate(schemaObj);
  }
  
  // If schema doesn't have properties, try to create a basic object
  if (!schemaObj.properties) {
    console.warn('Schema object has no properties:', schemaObj);
    // Return empty object or try to infer from schema type
    if (schemaObj.type === 'object') {
      return {};
    }
    return {};
  }
  
  const newObj = {};
  
  Object.entries(schemaObj.properties).forEach(([key, prop]) => {
    switch (prop.type) {
      case 'string':
        newObj[key] = prop.default || '';
        break;
      case 'number':
      case 'integer':
        newObj[key] = prop.default || 0;
        break;
      case 'boolean':
        newObj[key] = prop.default !== undefined ? prop.default : false;
        break;
      case 'array':
        newObj[key] = prop.default || [];
        break;
      case 'object':
        newObj[key] = createObjectFromSchema(prop);
        break;
      default:
        // Handle any type or unknown types
        if (prop.default !== undefined) {
          newObj[key] = prop.default;
        } else if (prop.enum && prop.enum.length > 0) {
          newObj[key] = prop.enum[0]; // Use first enum value as default
        } else {
          newObj[key] = null;
        }
    }
  });
  
  console.log('Created object from schema:', newObj);
  return newObj;
}

// Helper function to create object from template (for template-based schemas)
function createObjectFromTemplate(template) {
  if (!template || typeof template !== 'object') {
    console.warn('Invalid template provided:', template);
    return {};
  }
  
  const newObj = {};
  
  Object.entries(template).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Create empty array for arrays
      newObj[key] = [];
    } else if (typeof value === 'object' && value !== null) {
      // For objects, recursively create the structure
      newObj[key] = createObjectFromTemplate(value);
    } else if (typeof value === 'string') {
      newObj[key] = '';
    } else if (typeof value === 'number') {
      newObj[key] = 0;
    } else if (typeof value === 'boolean') {
      newObj[key] = false;
    } else {
      // For null or undefined, set appropriate default
      newObj[key] = null;
    }
  });
  
  console.log('Created object from template:', newObj);
  console.log('Original template was:', template);
  return newObj;
}

// Helper function to create minimal object with only essential properties
function createMinimalObjectFromTemplate(template) {
  if (!template || typeof template !== 'object') {
    console.warn('Invalid template provided for minimal object:', template);
    return {};
  }
  
  const newObj = {};
  
  // Only include properties that have non-empty values in the template
  Object.entries(template).forEach(([key, value]) => {
    if (typeof value === 'string' && value !== '') {
      newObj[key] = '';
    } else if (typeof value === 'number' && value !== 0) {
      newObj[key] = 0;
    } else if (typeof value === 'boolean') {
      newObj[key] = false;
    } else if (Array.isArray(value) && value.length > 0) {
      // Only include arrays that have content in the template
      newObj[key] = [];
    } else if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
      // Only include objects that have properties
      const nestedObj = createMinimalObjectFromTemplate(value);
      if (Object.keys(nestedObj).length > 0) {
        newObj[key] = nestedObj;
      }
    }
    // Skip empty strings, zero numbers, empty arrays, empty objects, null values
  });
  
  console.log('Created minimal object:', newObj);
  console.log('From template:', template);
  return newObj;
}

// Function to add new item to array
function addNewArrayItem(tabKey) {
  if (!Array.isArray(transformedData.value[tabKey])) {
    console.warn(`Tab key ${tabKey} is not an array`);
    return;
  }
  
  console.log('Adding new array item for:', tabKey);
  console.log('Schema available:', !!schema.value);
  
  const newItem = createNewObjectFromSchema(tabKey);
  console.log('Created new item:', newItem);
  
  // Update both transformedData and localData
  if (tabKey === 'General') {
    // Handle general properties differently
    console.warn('Cannot add array items to General tab');
    return;
  }
  
  localData.value[tabKey] = localData.value[tabKey] || [];
  localData.value[tabKey].push(newItem);
  
  console.log('Updated localData:', localData.value[tabKey]);
  
  // Select the new item
  const newIndex = localData.value[tabKey].length - 1;
  selectSubTab(tabKey, newIndex);
}

// Function to get missing properties based on schema
function getMissingProperties(currentObj, schemaPath) {
  if (!schema.value) return [];
  
  try {
    // Check if this is a template object (not JSON Schema format)
    if (schema.value[schemaPath] && Array.isArray(schema.value[schemaPath])) {
      const arrayTemplate = schema.value[schemaPath];
      if (arrayTemplate.length > 0) {
        const template = arrayTemplate[0];
        const existingKeys = Object.keys(currentObj || {});
        const templateKeys = Object.keys(template || {});
        return templateKeys.filter(key => !existingKeys.includes(key));
      }
    }
    
    // Handle direct template properties (for General tab)
    if (schemaPath === 'root' || schemaPath === 'General') {
      const existingKeys = Object.keys(currentObj || {});
      const schemaKeys = Object.keys(schema.value || {}).filter(key => !Array.isArray(schema.value[key]));
      return schemaKeys.filter(key => !existingKeys.includes(key));
    }
    
    // Handle JSON Schema format
    const pathParts = schemaPath.split('.');
    let currentSchema = schema.value;
    
    for (const part of pathParts) {
      if (currentSchema.properties && currentSchema.properties[part]) {
        currentSchema = currentSchema.properties[part];
      } else if (currentSchema.items) {
        currentSchema = currentSchema.items;
      } else {
        break;
      }
    }
    
    if (!currentSchema.properties) return [];
    
    const existingKeys = Object.keys(currentObj || {});
    const schemaKeys = Object.keys(currentSchema.properties);
    
    return schemaKeys.filter(key => !existingKeys.includes(key));
  } catch (error) {
    console.error('Error getting missing properties:', error);
    return [];
  }
}

// Function to add missing property
function addMissingProperty(propertyName, schemaPath) {
  if (!schema.value) return;
  
  try {
    let defaultValue;
    
    // Check if this is a template object (not JSON Schema format)
    if (schema.value[schemaPath] && Array.isArray(schema.value[schemaPath])) {
      const arrayTemplate = schema.value[schemaPath];
      if (arrayTemplate.length > 0) {
        const template = arrayTemplate[0];
        if (template[propertyName] !== undefined) {
          const templateValue = template[propertyName];
          if (Array.isArray(templateValue)) {
            defaultValue = [];
          } else if (typeof templateValue === 'object' && templateValue !== null) {
            defaultValue = createObjectFromTemplate(templateValue);
          } else if (typeof templateValue === 'string') {
            defaultValue = '';
          } else if (typeof templateValue === 'number') {
            defaultValue = 0;
          } else if (typeof templateValue === 'boolean') {
            defaultValue = false;
          } else {
            defaultValue = null;
          }
        }
      }
    }
    
    // Handle direct template properties (for General tab)
    if ((schemaPath === 'root' || schemaPath === 'General') && schema.value[propertyName] !== undefined) {
      const templateValue = schema.value[propertyName];
      if (Array.isArray(templateValue)) {
        defaultValue = [];
      } else if (typeof templateValue === 'object' && templateValue !== null) {
        defaultValue = createObjectFromTemplate(templateValue);
      } else if (typeof templateValue === 'string') {
        defaultValue = '';
      } else if (typeof templateValue === 'number') {
        defaultValue = 0;
      } else if (typeof templateValue === 'boolean') {
        defaultValue = false;
      } else {
        defaultValue = null;
      }
    }
    
    // Handle JSON Schema format (fallback)
    if (defaultValue === undefined) {
      const pathParts = schemaPath.split('.');
      let currentSchema = schema.value;
      
      for (const part of pathParts) {
        if (currentSchema.properties && currentSchema.properties[part]) {
          currentSchema = currentSchema.properties[part];
        } else if (currentSchema.items) {
          currentSchema = currentSchema.items;
        } else {
          break;
        }
      }
      
      if (currentSchema.properties && currentSchema.properties[propertyName]) {
        const propSchema = currentSchema.properties[propertyName];
        
        switch (propSchema.type) {
          case 'string':
            defaultValue = propSchema.default || '';
            break;
          case 'number':
          case 'integer':
            defaultValue = propSchema.default || 0;
            break;
          case 'boolean':
            defaultValue = propSchema.default || false;
            break;
          case 'array':
            defaultValue = [];
            break;
          case 'object':
            defaultValue = createObjectFromSchema(propSchema);
            break;
          default:
            defaultValue = propSchema.default || null;
        }
      }
    }
    
    // Add to the appropriate location
    if (activeTab.value === 'General') {
      localData.value[propertyName] = defaultValue;
    } else if (activeSubTab.value !== null) {
      localData.value[activeTab.value][activeSubTab.value][propertyName] = defaultValue;
    }
  } catch (error) {
    console.error('Error adding missing property:', error);
  }
}

// Function to delete array item
function deleteArrayItem(tabKey, index) {
  if (!Array.isArray(localData.value[tabKey]) || index < 0 || index >= localData.value[tabKey].length) return;
  
  if (confirm(`Are you sure you want to delete this ${formatLabel(tabKey).slice(0, -1).toLowerCase()}?`)) {
    localData.value[tabKey].splice(index, 1);
    
    // If we deleted the currently selected item, reset selection
    if (activeTab.value === tabKey && activeSubTab.value === index) {
      activeSubTab.value = null;
    } else if (activeTab.value === tabKey && activeSubTab.value > index) {
      // Adjust selection if we deleted an item before the current selection
      activeSubTab.value = activeSubTab.value - 1;
    }
  }
}

// Function to add item to nested array within an object
function addItemToNestedArray(tabKey, subTabIndex, arrayKey) {
  if (!localData.value[tabKey] || !localData.value[tabKey][subTabIndex] || !Array.isArray(localData.value[tabKey][subTabIndex][arrayKey])) {
    console.warn(`Invalid path for nested array: ${tabKey}[${subTabIndex}].${arrayKey}`);
    return;
  }
  
  console.log('Adding item to nested array:', tabKey, subTabIndex, arrayKey);
  
  // Try to get schema template for the nested array
  let newItem = null;
  
  if (schema.value && schema.value[tabKey] && Array.isArray(schema.value[tabKey]) && schema.value[tabKey].length > 0) {
    const parentTemplate = schema.value[tabKey][0];
    if (parentTemplate[arrayKey] && Array.isArray(parentTemplate[arrayKey]) && parentTemplate[arrayKey].length > 0) {
      const arrayItemTemplate = parentTemplate[arrayKey][0];
      
      // Check if the template item is a primitive type (number, string, boolean)
      if (typeof arrayItemTemplate === 'number') {
        newItem = 0;
      } else if (typeof arrayItemTemplate === 'string') {
        newItem = '';
      } else if (typeof arrayItemTemplate === 'boolean') {
        newItem = false;
      } else if (typeof arrayItemTemplate === 'object' && arrayItemTemplate !== null) {
        // Only create object template for actual objects
        newItem = createObjectFromTemplate(arrayItemTemplate);
      }
    }
  }
  
  // If no template found, check the existing array for type hints
  if (newItem === null && localData.value[tabKey][subTabIndex][arrayKey].length > 0) {
    const existingItem = localData.value[tabKey][subTabIndex][arrayKey][0];
    if (typeof existingItem === 'number') {
      newItem = 0;
    } else if (typeof existingItem === 'string') {
      newItem = '';
    } else if (typeof existingItem === 'boolean') {
      newItem = false;
    } else if (typeof existingItem === 'object' && existingItem !== null) {
      newItem = createObjectFromTemplate(existingItem);
    }
  }
  
  // Final fallback - but be smarter about it based on array name
  if (newItem === null) {
    // Check array name for hints about what type of data it should contain
    const arrayKeyLower = arrayKey.toLowerCase();
    if (arrayKeyLower.includes('id') || arrayKeyLower.includes('count') || arrayKeyLower.includes('number')) {
      newItem = 0; // Likely numeric
    } else if (arrayKeyLower.includes('name') || arrayKeyLower.includes('text') || arrayKeyLower.includes('description')) {
      newItem = ''; // Likely string
    } else if (arrayKeyLower.includes('enabled') || arrayKeyLower.includes('active') || arrayKeyLower.includes('flag')) {
      newItem = false; // Likely boolean
    } else {
      // Generic object fallback
      newItem = { name: '', value: '' };
    }
  }
  
  localData.value[tabKey][subTabIndex][arrayKey].push(newItem);
  console.log('Added item to nested array:', newItem);
}

// Function to delete item from nested array
function deleteNestedArrayItem(tabKey, subTabIndex, arrayKey, itemIndex) {
  if (!localData.value[tabKey] || !localData.value[tabKey][subTabIndex] || !Array.isArray(localData.value[tabKey][subTabIndex][arrayKey])) {
    console.warn(`Invalid path for nested array: ${tabKey}[${subTabIndex}].${arrayKey}`);
    return;
  }
  
  const array = localData.value[tabKey][subTabIndex][arrayKey];
  if (itemIndex < 0 || itemIndex >= array.length) {
    console.warn(`Invalid index ${itemIndex} for array of length ${array.length}`);
    return;
  }
  
  if (confirm(`Are you sure you want to delete this ${formatLabel(arrayKey).slice(0, -1).toLowerCase()}?`)) {
    array.splice(itemIndex, 1);
    console.log('Deleted item from nested array at index:', itemIndex);
  }
}

// Function to add entry to dictionary
function addDictionaryEntry(tabKey, subTabIndex, arrayKey, itemIndex, dictKey) {
  if (!localData.value[tabKey] || !localData.value[tabKey][subTabIndex] || !localData.value[tabKey][subTabIndex][arrayKey] || !localData.value[tabKey][subTabIndex][arrayKey][itemIndex]) {
    console.warn(`Invalid path for dictionary: ${tabKey}[${subTabIndex}].${arrayKey}[${itemIndex}].${dictKey}`);
    return;
  }
  
  const dictionary = localData.value[tabKey][subTabIndex][arrayKey][itemIndex][dictKey];
  if (typeof dictionary !== 'object' || Array.isArray(dictionary)) {
    console.warn('Target is not a dictionary object');
    return;
  }
  
  // Prompt user for new key
  const newKey = prompt('Enter key for new entry:');
  if (newKey && newKey.trim() && !dictionary.hasOwnProperty(newKey)) {
    dictionary[newKey] = '';
    console.log('Added new dictionary entry:', newKey);
  } else if (dictionary.hasOwnProperty(newKey)) {
    alert('Key already exists!');
  }
}

// Function to delete entry from dictionary
function deleteDictionaryEntry(tabKey, subTabIndex, arrayKey, itemIndex, dictKey, entryKey) {
  if (!localData.value[tabKey] || !localData.value[tabKey][subTabIndex] || !localData.value[tabKey][subTabIndex][arrayKey] || !localData.value[tabKey][subTabIndex][arrayKey][itemIndex]) {
    console.warn(`Invalid path for dictionary: ${tabKey}[${subTabIndex}].${arrayKey}[${itemIndex}].${dictKey}`);
    return;
  }
  
  const dictionary = localData.value[tabKey][subTabIndex][arrayKey][itemIndex][dictKey];
  if (typeof dictionary !== 'object' || Array.isArray(dictionary)) {
    console.warn('Target is not a dictionary object');
    return;
  }
  
  if (confirm(`Are you sure you want to delete the entry "${entryKey}"?`)) {
    delete dictionary[entryKey];
    console.log('Deleted dictionary entry:', entryKey);
  }
}

// Function to update dictionary key
function updateDictionaryKey(tabKey, subTabIndex, arrayKey, itemIndex, dictKey, oldKey, newKey) {
  if (!localData.value[tabKey] || !localData.value[tabKey][subTabIndex] || !localData.value[tabKey][subTabIndex][arrayKey] || !localData.value[tabKey][subTabIndex][arrayKey][itemIndex]) {
    console.warn(`Invalid path for dictionary: ${tabKey}[${subTabIndex}].${arrayKey}[${itemIndex}].${dictKey}`);
    return;
  }
  
  const dictionary = localData.value[tabKey][subTabIndex][arrayKey][itemIndex][dictKey];
  if (typeof dictionary !== 'object' || Array.isArray(dictionary)) {
    console.warn('Target is not a dictionary object');
    return;
  }
  
  // If key hasn't changed, do nothing
  if (oldKey === newKey) return;
  
  // Check if new key already exists
  if (newKey && newKey.trim() && dictionary.hasOwnProperty(newKey)) {
    alert('Key already exists!');
    return;
  }
  
  // If new key is valid, update the dictionary
  if (newKey && newKey.trim()) {
    const value = dictionary[oldKey];
    delete dictionary[oldKey];
    dictionary[newKey] = value;
    console.log('Updated dictionary key:', oldKey, '->', newKey);
  }
}
</script>

<template>
  <div v-if="props.show" class="py-9 px-8 ">
    <div class="w-full min-w-[320px] max-w-full  md:min-w-[950px] md:max-w-[70vw] rounded-2xl shadow-md bg-modal-color border border-color flex flex-col" style="z-index: 10; position: relative;">
      <!-- Top line with label -->
      <div class="w-full flex items-center border-b border-color px-7 py-4 mb-2">
      <span class="inline-block align-middle px-2.5">
                <img src="@/assets/payment.png" alt="Payment icon" width="36" height="36" class="inline-block align-middle mr-1 payment-icon" />
                <span class="sr-only">Payment icon</span>
              </span>
        <span class="text-xl font-semibold text-gray-900 dark:text-white tracking-wide">EPS Configuration</span>
        <!-- Loading indicator for enums -->
        <div v-if="enumsLoading" class="ml-auto flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading options...
        </div>
      </div>
      
      <div class="flex flex-1 min-h-0">
        <!-- Tabs on the left -->
        <ul
          class="flex flex-col w-63 text-sm font-medium text-left text-white-900 dark:text-white-900 py-2 px-4"
          role="tablist"
        >
          <li v-for="key in Object.keys(filteredData)" :key="key" class="flex flex-col">
            <!-- Main tab button -->
            <div class="tab-animate flex items-center flex-1 text-left px-2 py-1.5 my-1.5 mx-3 cursor-pointer"
              :class="[activeTab === key && activeSubTab === null ? 'active text-color font-semibold' : 'text-color-secondary']"
              style="position:relative;">
              <component
                :is="iconMap[key] || Cog6ToothIcon"
                class="w-5 h-5 mr-2"
              />
              <span
                class="flex-1"
                @click="selectMainTab(key)"
                style="user-select: none;"
              >
                {{
                  formatLabel(key)
                    .replace(/configuration/i, "")
                    .trim()
                }}
              </span>
              <!-- Chevron for collapsible tabs -->
              <ChevronDownIcon
                v-if="Array.isArray(filteredData[key])"
                class="w-4 h-4 ml-auto transition-transform duration-100"
                :class="{ 'rotate-180': !collapsedTabs.has(key) }"
                @click.stop="toggleTabCollapse(key)"
                style="cursor:pointer;"
              />
              <span class="tab-border"></span>
            </div>
            
            <!-- Sub-tabs for array items with smooth transition -->
            <transition name="subtab-fade" mode="out-in">
              <div
                v-if="Array.isArray(filteredData[key]) && !collapsedTabs.has(key)"
                class="ml-5 space-y-1 subtab-transition-wrapper"
                key="subtab-list"
              >
                <button
                  v-for="(item, index) in filteredData[key]"
                  :key="`${key}-${index}`"
                  type="button"
                  class="tab-animate flex items-center w-full text-left px-2 py-1 mx-3 cursor-pointer text-sm"
                  :class="[activeTab === key && activeSubTab === index
                    ? 'active text-color font-medium'
                    : 'text-color-secondary']"
                  @click="selectSubTab(key, index)"
                  style="position:relative;"
                >
                  <span class="w-2 h-2 rounded-full bg-current mr-2 opacity-50"></span>
                  {{ formatLabel(key).slice(0, -1) }} {{ index + 1 }}
                  <span class="tab-border"></span>
                </button>
              </div>
            </transition>
          </li>
        </ul>
        <!-- Content on the right -->
        <div class="flex-1 min-h-0 table flex-col">
          <transition name="tab-content" mode="out-in">
            <div
              v-if="activeTab && filteredData[activeTab]"
              :key="activeTab + activeSubTab + props.searchValue"
              class="rounded-xl md:pr-15 md:pl-5 flex-1 overflow-y-auto"
            >
            
            <h2
              class="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
            </h2>
            
            <!-- General tab or main tab without sub-selection -->
            <template v-if="(activeTab === 'General' || !Array.isArray(filteredData[activeTab])) && activeSubTab === null">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-15 gap-y-4">
                <!-- Non-boolean fields first -->
                <template
                  v-for="(propValue, propKey) in nonBooleanFields(filteredData[activeTab])"
                  :key="propKey"
                >
                  <InputTransparent
                    :label="formatLabel(propKey)"
                    :placeholder="String(propValue)"
                    v-model="localData[propKey]"
                    :type="getEnumOptionsForProperty(activeTab, propKey) ? 'select' : 'text'"
                    :options="getEnumOptionsForProperty(activeTab, propKey) || undefined"
                    class="w-full m-1"
                  />
                </template>
                <!-- Spacer before booleans, only if there are boolean fields -->
                <template v-if="Object.keys(booleanFields(filteredData[activeTab])).length">
                  <div class="my-8 col-span-full"></div>
                </template>
                <!-- Boolean fields at the end, with slider (no icon) -->
                <template
                  v-for="(propValue, propKey) in booleanFields(filteredData[activeTab])"
                  :key="propKey"
                >
                  <div class="flex items-center space-x-3 mx-3 ">
                    <label :for="`${activeTab}-${propKey}`" class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">{{
                      formatLabel(propKey)
                    }}</label>
                    <!-- Slider toggle switch -->
                    <label class="inline-flex items-center cursor-pointer ml-auto">
                      <input
                        type="checkbox"
                        class="sr-only peer"
                        :id="`${activeTab}-${propKey}`"
                        v-model="localData[propKey]"
                      />
                      <div
                        :class=" [
                          'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                          localData[propKey]
                            ? 'boolean-selector-active'
                            : 'boolean-selector-inactive'
                        ]"
                        style="border: 0px solid var(--toggle-border);"
                      ></div>
                    </label>
                  </div>
                </template>
              </div>
            </template>
            
            <!-- Single sub-tab item view -->
            <template v-else-if="Array.isArray(filteredData[activeTab]) && activeSubTab !== null">
              <div class="space-y-4">
                <div class="bg-white bg-modal-color p-4">
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ formatLabel(activeTab).slice(0, -1) }} {{ activeSubTab + 1 }}
                    </h3>
                    <button
                      @click="deleteArrayItem(activeTab, activeSubTab)"
                      class="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 rounded-lg transition-colors"
                      title="Delete this item"
                    >
                      <TrashIcon class="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                  <div v-if="typeof filteredData[activeTab][activeSubTab] === 'object' && filteredData[activeTab][activeSubTab] !== null" class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">

                    <transition name="slide-fade" mode="out-in">
                      <!-- Primitive properties panel -->
                      <div v-if="!showArrayProperties" key="primitive" class="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <!-- Non-boolean fields first -->
                        <template
                          v-for="(propValue, propKey) in nonBooleanFields(filteredData[activeTab][activeSubTab])"
                          :key="propKey"
                        >
                          <InputTransparent
                            :label="formatLabel(propKey)"
                            :placeholder="String(propValue)"
                            v-model="localData[activeTab][activeSubTab][propKey]"
                            :type="getEnumOptionsForProperty(activeTab, propKey) ? 'select' : 'text'"
                            :options="getEnumOptionsForProperty(activeTab, propKey) || undefined"
                            class="w-full m-1"
                          />
                        </template>

                        <!-- Spacer before boolean fields (if any) -->
                        <template v-if="Object.keys(booleanFields(filteredData[activeTab][activeSubTab])).length">
                          <div class="my-3.5 col-span-full"></div>
                        </template>

                        <!-- Boolean fields -->
                        <template
                          v-for="(propValue, propKey) in booleanFields(filteredData[activeTab][activeSubTab])"
                          :key="propKey"
                        >
                          <div class="flex items-center space-x-3 mx-3">
                            <label :for="`${activeTab}-${activeSubTab}-${propKey}`" class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">{{
                              formatLabel(propKey)
                            }}</label>
                            <label class="inline-flex items-center cursor-pointer ml-auto">
                              <input
                                type="checkbox"
                                class="sr-only peer"
                                :id="`${activeTab}-${activeSubTab}-${propKey}`"
                                v-model="localData[activeTab][activeSubTab][propKey]"
                              />
                              <div
                                :class=" [
                                  'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                                  localData[activeTab][activeSubTab][propKey]
                                    ? 'boolean-selector-active'
                                    : 'boolean-selector-inactive'
                                ]"
                                style="border: 0px solid var(--toggle-border);"
                              ></div>
                            </label>
                          </div>
                        </template>
                      </div>

                      <!-- Array properties panel -->
                      <div v-else key="array" class="col-span-full">
                        <template v-if="Object.keys(arrayFields(filteredData[activeTab][activeSubTab])).length">
                          <template v-for="(arr, arrKey) in arrayFields(filteredData[activeTab][activeSubTab])" :key="`array-${arrKey}`">
                            <details class=" my-2">
                              <summary class="font-semibold text-gray-900 dark:text-white">{{ formatLabel(arrKey) }} ({{ Array.isArray(arr) ? arr.length : 0 }})</summary>
                              <div v-if="Array.isArray(arr) && arr.length > 0" class="space-y-2 mt-2">
                                <div class="flex justify-end mb-2">
                                  <button
                                    @click="addItemToNestedArray(activeTab, activeSubTab, arrKey)"
                                    class="flex items-center justify-center w-6 h-6 text-color-secondary bg-gray-100 dark:bg-gray-700 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200 rounded transition-colors"
                                    :title="`Add ${formatLabel(arrKey).slice(0, -1)}`"
                                  >
                                    <PlusIcon class="w-4 h-4" />
                                  </button>
                                </div>
                                <transition-group name="item-fade" tag="div" class="space-y-2">
                                  <div v-for="(element, idx) in arr" :key="`element-${arrKey}-${idx}-${element.id || idx}`" class="border border-gray-200 dark:border-neutral-700 rounded p-2 mb-2">
                                    <div v-if="typeof element === 'object' && element !== null">
                                      <details class="mb-2">
                                      <summary class="font-semibold text-gray-900 dark:text-white cursor-pointer flex justify-between items-center">
                                        <span>{{ formatLabel(arrKey) }} Item {{ idx + 1 }}</span>
                                        <button
                                          @click.stop="deleteNestedArrayItem(activeTab, activeSubTab, arrKey, idx)"
                                          class="ml-2 p-1 text-color-secondary hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                          title="Delete this item"
                                        >
                                          <TrashIcon class="w-4 h-4" />
                                        </button>
                                      </summary>
                                      <div class="mt-2">
                                        <!-- Non-boolean and object fields first -->
                                        <template v-for="(elValue, elKey) in element" :key="`non-bool-${elKey}`">
                                            <div v-if="typeof elValue === 'object' && elValue !== null">
                                                <details class="mb-2">
                                                    <summary class="font-semibold cursor-pointer">{{ formatLabel(elKey) }}</summary>
                                                     <div class="mt-2">
                                                        <!-- Check if it's a dictionary-like object (has string keys) -->
                                                        <div v-if="typeof elValue === 'object' && elValue !== null && !Array.isArray(elValue)">
                                                            <div class="space-y-2">
                                                                <div class="flex justify-end mb-2">
                                                                    <button
                                                                        @click="addDictionaryEntry(activeTab, activeSubTab, arrKey, idx, elKey)"
                                                                        class="flex items-center justify-center w-6 h-6 text-color-secondary bg-gray-100 dark:bg-gray-700 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200 rounded transition-colors"
                                                                        title="Add Entry"
                                                                    >
                                                                        <PlusIcon class="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                                <transition-group name="item-fade" tag="div" class="space-y-2">
                                                                  <div v-for="(dictValue, dictKey) in elValue" :key="`dict-${dictKey}-${JSON.stringify(dictValue)}`" class="flex items-center space-x-2 border border-gray-200 dark:border-neutral-700 rounded p-2">
                                                                      <div class="flex-1 grid grid-cols-2 gap-2">
                                                                          <InputTransparent
                                                                              :label="'Key'"
                                                                              :placeholder="String(dictKey)"
                                                                              :modelValue="dictKey"
                                                                              @update:modelValue="updateDictionaryKey(activeTab, activeSubTab, arrKey, idx, elKey, dictKey, $event)"
                                                                              class="w-full"
                                                                          />
                                                                          <InputTransparent
                                                                              :label="'Value'"
                                                                              :placeholder="String(dictValue)"
                                                                              v-model="localData[activeTab][activeSubTab][arrKey][idx][elKey][dictKey]"
                                                                              class="w-full"
                                                                          />
                                                                      </div>
                                                                      <button
                                                                          @click="deleteDictionaryEntry(activeTab, activeSubTab, arrKey, idx, elKey, dictKey)"
                                                                          class="p-1 text-color-secondary hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                                          title="Delete this entry"
                                                                      >
                                                                          <TrashIcon class="w-3 h-3" />
                                                                      </button>
                                                                  </div>
                                                                </transition-group>
                                                                <div v-if="Object.keys(elValue).length === 0" class="text-gray-500 dark:text-gray-400 italic text-center py-2">
                                                                    No entries - click the + button above to add your first entry
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- Regular nested object handling - non-boolean fields first -->
                                                        <template v-else>
                                                          <template v-for="(subElValue, subElKey) in elValue" :key="`non-bool-${subElKey}`">
                                                            <InputTransparent
                                                                v-if="typeof subElValue !== 'boolean'"
                                                                :label="formatLabel(subElKey)"
                                                                :placeholder="String(subElValue)"
                                                                v-model="localData[activeTab][activeSubTab][arrKey][idx][elKey][subElKey]"
                                                                :type="getEnumOptionsForProperty(activeTab, subElKey) ? 'select' : 'text'"
                                                                :options="getEnumOptionsForProperty(activeTab, subElKey) || undefined"
                                                                class="w-full m-1"
                                                            />
                                                          </template>
                                                          <!-- Boolean fields grouped together -->
                                                          <template v-if="Object.values(elValue).some(v => typeof v === 'boolean')">
                                                            <div class="my-3"></div>
                                                            <template v-for="(subElValue, subElKey) in elValue" :key="`bool-${subElKey}`">
                                                              <div v-if="typeof subElValue === 'boolean'" class="flex items-center space-x-3 mx-1 my-2">
                                                                <label :for="`${activeTab}-${activeSubTab}-${arrKey}-${idx}-${elKey}-${subElKey}`" class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">{{
                                                                  formatLabel(subElKey)
                                                                }}</label>
                                                                <label class="inline-flex items-center cursor-pointer ml-auto">
                                                                  <input
                                                                    type="checkbox"
                                                                    class="sr-only peer"
                                                                    :id="`${activeTab}-${activeSubTab}-${arrKey}-${idx}-${elKey}-${subElKey}`"
                                                                    v-model="localData[activeTab][activeSubTab][arrKey][idx][elKey][subElKey]"
                                                                  />
                                                                  <div
                                                                    :class=" [
                                                                      'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                                                                      localData[activeTab][activeSubTab][arrKey][idx][elKey][subElKey]
                                                                        ? 'boolean-selector-active'
                                                                        : 'boolean-selector-inactive'
                                                                    ]"
                                                                    style="border: 0px solid var(--toggle-border);"
                                                                  ></div>
                                                                </label>
                                                              </div>
                                                            </template>
                                                          </template>
                                                        </template>
                                                     </div>
                                                </details>
                                            </div>

                                            <!-- Non-boolean, non-object fields -->
                                            <div v-else-if="typeof elValue !== 'boolean'" class="text-gray-600 dark:text-gray-400">
                                                <InputTransparent
                                                :label="formatLabel(elKey)"
                                                :placeholder="String(elValue)"
                                                v-model="localData[activeTab][activeSubTab][arrKey][idx][elKey]"
                                                :type="getEnumOptionsForProperty(activeTab, elKey) ? 'select' : 'text'"
                                                :options="getEnumOptionsForProperty(activeTab, elKey) || undefined"
                                                class="w-full m-1"
                                            />
                                            </div>
                                        </template>

                                        <!-- Boolean fields grouped together at the end -->
                                        <template v-if="Object.values(element).some(v => typeof v === 'boolean')">
                                          <div class="my-4"></div>
                                          <template v-for="(elValue, elKey) in element" :key="`bool-${elKey}`">
                                            <div v-if="typeof elValue === 'boolean'" class="flex items-center space-x-3 mx-1 my-2">
                                              <label :for="`${activeTab}-${activeSubTab}-${arrKey}-${idx}-${elKey}`" class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">{{
                                                formatLabel(elKey)
                                              }}</label>
                                              <label class="inline-flex items-center cursor-pointer ml-auto">
                                                <input
                                                  type="checkbox"
                                                  class="sr-only peer"
                                                  :id="`${activeTab}-${activeSubTab}-${arrKey}-${idx}-${elKey}`"
                                                  v-model="localData[activeTab][activeSubTab][arrKey][idx][elKey]"
                                                />
                                                <div
                                                  :class=" [
                                                    'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                                                    localData[activeTab][activeSubTab][arrKey][idx][elKey]
                                                      ? 'boolean-selector-active'
                                                      : 'boolean-selector-inactive'
                                                  ]"
                                                  style="border: 0px solid var(--toggle-border);"
                                                ></div>
                                              </label>
                                            </div>
                                          </template>
                                        </template>
                                      </div>
                                    </details>
                                  </div>
                                  <div v-else class="flex items-center justify-between">
                                    <div class="flex-1 mr-2">
                                      <InputTransparent
                                        :label="`${formatLabel(arrKey).slice(0, -1)} ${idx + 1}`"
                                        :placeholder="String(element)"
                                        v-model="localData[activeTab][activeSubTab][arrKey][idx]"
                                        :type="typeof element === 'number' ? 'number' : 'text'"
                                        class="w-full"
                                      />
                                    </div>
                                    <button
                                      @click="deleteNestedArrayItem(activeTab, activeSubTab, arrKey, idx)"
                                      class="p-1 text-color-secondary hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                      title="Delete this item"
                                    >
                                      <TrashIcon class="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </transition-group>
                              </div>
                              <div v-else class="text-gray-500 dark:text-gray-400 italic mt-2">
                                <div class="flex items-center justify-between">
                                  <span>No items</span>
                                  <button
                                    @click="addItemToNestedArray(activeTab, activeSubTab, arrKey)"
                                    class="flex items-center justify-center w-6 h-6 text-color-secondary bg-gray-100 dark:bg-gray-700 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200 rounded transition-colors"
                                    :title="`Add ${formatLabel(arrKey).slice(0, -1)}`"
                                  >
                                    <PlusIcon class="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </details>
                          </template>
                        </template>
                      </div>
                    </transition>

                  </div>
                  
                  <!-- More Properties toggle button at the bottom -->
                  <div v-if="Object.keys(arrayFields(filteredData[activeTab][activeSubTab])).length > 0" class="flex justify-center mt-10">
                    <button
                      @click="toggleArrayProperties"
                      class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
                      :title="showArrayProperties ? 'Show basic properties' : 'Show more properties'"
                    >
                      <ListBulletIcon class="w-4 h-4 mr-2" />
                      <span>{{ showArrayProperties ? 'Basic Properties' : 'More Properties' }}</span>
                      <ChevronDownIcon 
                        class="w-4 h-4 ml-2 transition-transform duration-100"
                        :class="{ 'rotate-180': showArrayProperties }"
                      />
                    </button>
                  </div>
                  
                </div>
              </div>
            </template>
            
            
            <!-- List tabs - show all array items (when no sub-tab is selected) -->
            <template v-else-if="Array.isArray(filteredData[activeTab]) && activeSubTab === null">
              <div class="space-y-4">
                <!-- Add new item button -->
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ formatLabel(activeTab) }}
                  </h2>
                  <button
                    @click="addNewArrayItem(activeTab)"
                    class="flex items-center justify-center w-8 h-8 text-color-secondary bg-gray-100 dark:bg-gray-700 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200 rounded-lg transition-colors"
                    :title="`Add New ${formatLabel(activeTab).slice(0, -1)}`"
                  >
                    <PlusIcon class="w-5 h-5" />
                  </button>
                </div>
                
                <div v-if="filteredData[activeTab].length === 0" class="text-gray-500 dark:text-gray-400 text-center py-8">
                  No {{ formatLabel(activeTab).toLowerCase() }} configured
                </div>
                <transition-group name="item-fade" tag="div" class="space-y-4">
                  <div 
                    v-for="(item, index) in filteredData[activeTab]" 
                    :key="`main-item-${index}-${item.id || JSON.stringify(item).slice(0,50)}`"
                    class="bg-white bg-modal-color rounded-lg border border-gray-200 dark:border-neutral-700 p-4 shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    <div class="flex justify-between items-start">
                      <div class="flex-1 cursor-pointer" @click="selectSubTab(activeTab, index)">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          {{ formatLabel(activeTab).slice(0, -1) }} {{ index + 1 }}
                        </h3>
                        <div v-if="typeof item === 'object' && item !== null" class="text-sm text-gray-600 dark:text-gray-400">
                          Click to edit this {{ formatLabel(activeTab).slice(0, -1).toLowerCase() }}
                        </div>
                        <div v-else class="text-gray-600 dark:text-gray-400">
                          {{ item }}
                        </div>
                      </div>
                      <button
                        @click.stop="deleteArrayItem(activeTab, index)"
                        class="ml-3 p-1 text-color-secondary hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Delete this item"
                      >
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </transition-group>
              </div>
            </template>
            
            <div
              v-else-if="filteredData[activeTab] === null"
              class="text-gray-500 dark:text-gray-400"
            >
              No data
            </div>
            </div>
          </transition>
        </div>
      </div>
      
      <!-- Search and Button always at the bottom of the card -->
      <div class="flex flex-col md:flex-row items-center justify-end gap-4 mt-8 mb-4 px-8">
        <button
          @click="updateConfiguration"
          class="p-4 text-white bg-blue-600 focus:outline-none hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-full text-sm px-10 py-2.5 dark:bg-blue-700 dark:text-white dark:border-blue-600 dark:hover:bg-blue-800 dark:hover:border-blue-600 dark:focus:ring-blue-800"
        >
          Update Configuration
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-animate {
  position: relative;
  transition: color 0.2s;
}
.tab-animate .tab-border {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: var(--input-border-color-selected); /* use the selector color */
  border-radius: 2px;
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  pointer-events: none;
}
.tab-animate.active .tab-border {
  transform: scaleX(1);
}

/* Hide the default triangle/marker for <summary> in <details> */
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}

/* Tint payment icon to white in dark mode */
.dark .payment-icon {
  filter: brightness(0) invert(1);
}
/* Sub-tab open/close animation */
.subtab-fade-enter-active, .subtab-fade-leave-active {
  transition: max-height 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}
.subtab-fade-enter-from, .subtab-fade-leave-to {
  max-height: 0;
  opacity: 0;
}
.subtab-fade-enter-to, .subtab-fade-leave-from {
  max-height: 500px;
  opacity: 1;
}

/* Main tab content transition */
.tab-content-enter-active, .tab-content-leave-active {
  transition: opacity 120ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 120ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.tab-content-enter-from, .tab-content-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
.tab-content-enter-to, .tab-content-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Slide + fade used for property panel toggles */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 100ms ease-out, transform 100ms ease-out;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.slide-fade-enter-to, .slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Item add/delete animations for dynamic lists */
.item-fade-enter-active, .item-fade-leave-active {
  transition: all 150ms ease-out;
}
.item-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
.item-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
.item-fade-enter-to, .item-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.item-fade-move {
  transition: transform 150ms ease-out;
}
</style>
