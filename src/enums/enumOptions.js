const enumOptions = {
  OptType: [
    { value: 0, label: "DispenserIntegrated" },
    { value: 1, label: "Pedestal" }
  ],
  PrimaryLanguage: [
    { value: 0, label: "None" },
    { value: 1, label: "Portuguese" },
    { value: 2, label: "English" },
    { value: 3, label: "Spanish" },
    { value: 4, label: "Catalan" },
    { value: 5, label: "French" }
  ],
  SecondaryLanguage: [
    { value: 0, label: "None" },
    { value: 1, label: "Portuguese" },
    { value: 2, label: "English" },
    { value: 3, label: "Spanish" },
    { value: 4, label: "Catalan" },
    { value: 5, label: "French" }
  ],
  TertiaryLanguage: [
    { value: 0, label: "None" },
    { value: 1, label: "Portuguese" },
    { value: 2, label: "English" },
    { value: 3, label: "Spanish" },
    { value: 4, label: "Catalan" },
    { value: 5, label: "French" }
  ],
  LanguageN4 : [
    { value: 0, label: "None" },
    { value: 1, label: "Portuguese" },
    { value: 2, label: "English" },
    { value: 3, label: "Spanish" },
    { value: 4, label: "Catalan" },
    { value: 5, label: "French" }
  ],
  CountryCode :[
    { value: 0, label: "PT" },
    { value: 1, label: "ES" },
    { value: 2, label: "CA" }
  ],
  Company: [
    { value: 0, label: "Generic" },
    { value: 10, label: "Galp" },
    { value: 5001, label: "Prio" },
    { value: 5002, label: "Intermarche" },
    { value: 5003, label: "Bongas" }
  ],
  PedModel : [
    { value: 0, label: "Verifone" },
    { value: 1, label: "Ingenico" }
  ],
  ControllerType: [
    { value: 0, label: "DomsPssController" },
    { value: 1, label: "MycrosysFcc" }
  ],
  BnaConfiguration: {
    Model: [
      { value: 0, label: "JCM_EBA_34_EUR5" },
      { value: 1, label: "DummyController" }
    ]
  },
  PrepayTicketMode : [
    { value: 0, label: "Auto" },
    { value: 1, label: "Ask" },
    { value: 2, label: "Disabled" }
  ],
  CashOperationMode: [
    { value: 0, label: "Prepay" },
    { value: 1, label: "PostPay" }
  ],
  PrintReceiptMode: [
    { value: 0, label: "Paper" },
    { value: 1, label: "Email" },
    { value: 2, label: "Digital" }
  ],
  AuthorizationTicketMode: [
    { value: 0, label: "Disabled" },
    { value: 1, label: "Ask" },
    { value: 2, label: "Auto" }
  ],
  TypeOfDiscountTaxFormula: [
    { value: 1, label: "Type1" },
    { value: 2, label: "Type2" }
  ],
  BarcodeReaderConfiguration: {
    Model: [
      { value: 0, label: "Gryphon" },
      { value: 1, label: "Newland" }
    ]
  },
};

export function getEnumOptions(tab, prop) {
  if (enumOptions[tab] && typeof enumOptions[tab] === "object" && enumOptions[tab][prop]) {
    return enumOptions[tab][prop];
  }
  const tabKey = Object.keys(enumOptions).find(
    k => k.toLowerCase() === tab.toLowerCase()
  );
  if (
    tabKey &&
    typeof enumOptions[tabKey] === "object" &&
    enumOptions[tabKey][prop]
  ) {
    return enumOptions[tabKey][prop];
  }

  if (enumOptions[prop]) {
    return enumOptions[prop];
  }
  return null;
}

export default enumOptions;