<template>
  <div class="p-6 space-y-6">
    <!-- Header Section -->
    <div class="bg-modal-color-gradient rounded-2xl p-8 border border-color shadow-lg">
      <div class="flex items-center space-x-6">
        <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
          {{ initials }}
        </div>
        <div class="flex-1">
          <h1 class="text-4xl font-bold text-color mb-2">{{ profile.name }}</h1>
          <h2 class="text-xl text-gray-400 mb-4">{{ profile.title }}</h2>
          <div class="flex flex-wrap gap-4 text-sm text-gray-400">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              {{ profile.email }}
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              {{ profile.phone }}
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              {{ profile.location }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Section -->
    <div id="summary" class="bg-modal-color-gradient rounded-2xl p-6 border border-color shadow-lg">
      <h3 class="text-2xl font-bold text-color mb-4 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
        </svg>
        Professional Summary
      </h3>
      <p class="text-gray-400 leading-relaxed">{{ profile.summary }}</p>
    </div>

        <!-- Skills Section -->
    <div id="skills" class="bg-modal-color-gradient rounded-2xl p-6 border border-color shadow-lg">
      <h3 class="text-2xl font-bold text-color mb-4 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
        </svg>
        Technical Skills
      </h3>
      <div class="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div v-for="(skillCategory, category) in profile.skills" :key="category" class="space-y-2">
          <h4 class="text-sm font-semibold text-color flex items-center mb-3">
            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
            {{ category }}
          </h4>
          <div class="space-y-1.5">
            <div v-for="(skill, idx) in skillCategory" :key="idx" class="group border-l-4 border-blue-500 pl-3 hover:border-purple-500 transition-all duration-300 cursor-pointer p-2 rounded-r-lg hover:bg-blue-500/5">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-blue-400">{{ skill.name }}</span>
                <svg class="w-3 h-3 text-blue-400 opacity-50 transition-opacity flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>
              <div class="text-xs text-gray-400 max-h-0 opacity-0 group-hover:max-h-96 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                {{ skill.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Experience Section -->
    <div id="experience" class="bg-modal-color-gradient rounded-2xl p-6 border border-color shadow-lg">
      <h3 class="text-2xl font-bold text-color mb-6 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
        </svg>
        Work Experience
      </h3>
      <div class="space-y-4">
        <div v-for="(job, index) in profile.experience" :key="index" class="group border-l-4 border-blue-500 pl-4 hover:border-purple-500 transition-all duration-300 cursor-pointer p-3 rounded-r-lg hover:bg-blue-500/5">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-color">{{ job.position }}</h4>
              <p class="text-gray-400">{{ job.company }}</p>
              <p v-if="job.location" class="text-sm text-gray-500">{{ job.location }}</p>
            </div>
            <span class="text-sm text-gray-500 ml-4">{{ job.period }}</span>
          </div>
          <ul class="list-disc list-inside text-gray-400 space-y-1 max-h-0 opacity-0 group-hover:max-h-96 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
            <li v-for="(responsibility, idx) in job.responsibilities" :key="idx">{{ responsibility }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Education Section -->
    <div id="education" class="bg-modal-color-gradient rounded-2xl p-6 border border-color shadow-lg">
      <h3 class="text-2xl font-bold text-color mb-6 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
        </svg>
        Education
      </h3>
      <div class="space-y-4">
        <div v-for="(edu, index) in profile.education" :key="index" class="border-l-4 border-green-500 pl-4 hover:border-yellow-500 transition-colors duration-300">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="text-lg font-semibold text-color">{{ edu.degree }}</h4>
              <p class="text-gray-400">{{ edu.institution }}</p>
              <p v-if="edu.gpa" class="text-sm text-gray-500 mt-1">{{ edu.gpa }}</p>
            </div>
            <span class="text-sm text-gray-500">{{ edu.year }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Certifications Section -->
    <div id="certifications" class="bg-modal-color-gradient rounded-2xl p-6 border border-color shadow-lg">
      <h3 class="text-2xl font-bold text-color mb-6 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        Certifications & Achievements
      </h3>
      <ul class="space-y-3">
        <li v-for="(cert, index) in profile.certifications" :key="index" 
            class="flex items-start text-gray-400 hover:text-color transition-colors duration-200">
          <svg class="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ cert }}</span>
        </li>
      </ul>
    </div>

    <!-- Languages Section -->
    <div id="languages" class="bg-modal-color-gradient rounded-2xl p-6 border border-color shadow-lg">
      <h3 class="text-2xl font-bold text-color mb-6 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clip-rule="evenodd"></path>
        </svg>
        Languages
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="(proficiency, language) in profile.languages" :key="language" 
             class="text-center p-3 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors duration-200">
          <p class="text-color font-semibold">{{ language }}</p>
          <p class="text-sm text-gray-400">{{ proficiency }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const profile = {
  name: "Diogo Miguel Rebelo Barroso",
  title: "Senior Software Engineer | Full Stack Developer",
  email: "email@example.com",
  phone: "+351 123 456 789",
  location: "Portugal",
  summary: "Experienced software engineer with 5+ years of expertise in full-stack development, system architecture, and embedded systems. Specialized in building scalable web applications and containerized solutions. Proven track record in leading development teams and delivering high-quality software solutions.",
  
  experience: [
    {
      position: "Software Engineer - Embedded Systems. Eng.",
      company: "Petrotec",
      period: "February 2024 - Present",
      responsibilities: [
        "As a Software Engineer, I specialize in backend development with .NET, focusing on Linux-based and embedded systems.",
        "I leverage Docker for containerization and ensure secure communications through SSH and encryption.",
        "My experience includes designing and developing microservices, building and integrating RESTful APIs, enabling HTTPS and WebSocket communication for efficient data exchange, and utilizing MQTT for reliable real-time messaging.",
        "Integration of advanced hardware interfaces on microcomputer boards by developing custom device drivers, ensuring seamless data acquisition and robust system reliability for critical industrial applications in the energy sector."
      ]
    },
    {
      position: "Experienced Programmer",
      company: "Deloitte",
      period: "February 2022 - February 2024",
      responsibilities: [
        "Designed databases using SQL Server and MongoDB for efficient data storage.",
        "Collaborated in cross-functional teams to gather requirements for new applications.",
        "Developed scalable software applications across multiple platforms.",
        "Integrated third-party APIs to enhance software interoperability.",
        "Streamlined deployment pipelines by automating testing and integration processes, enabling faster release cycles and improved code reliability."
      ]
    },
    {
      position: "Teacher",
      company: "Ε.Ρ.Α",
      period: "February 2020 - February 2022",
      responsibilities: [
        "Developed and delivered comprehensive lesson plans on electricity, electronics, and digital systems, adapting instructional methods to accommodate varying student learning styles.",
        "Guided laboratory sessions and hands-on experiments, reinforcing foundational concepts in electricity and electronics while ensuring adherence to safety protocols.",
        "Assessed student progress by designing and grading assignments, projects, and exams, providing timely feedback to support mastery of course objectives."
      ]
    },
    {
      position: "Estimator",
      company: "Sotécnica Lisbon Airport",
      period: "March 2019 - August 2019",
      responsibilities: [
        "Prepared comprehensive cost analyses and project bids for airport electrical systems, aligning with regulatory standards and optimizing resource allocation to ensure budgetary compliance and operational efficiency.",
        "Formulated detailed quantity takeoffs and material estimates for large-scale electrical infrastructure projects, ensuring alignment with project specifications and compliance requirements."
      ]
    }
  ],
  
  education: [
    {
      degree: "Master's in Electrical and Computer Engineering",
      institution: "Instituto Politecnico de Setúbal",
      year: "2021",
      gpa: "3.5 GPA (17.5 Average)"
    }
  ],
  
  skills: {
    "Backend Development": [
      { name: ".NET Core (up to version 9), Microservices", description: "Scalable microservices and distributed systems with .NET Core 1.0-9" },
      { name: "ASP.NET Web API, RESTful Services", description: "RESTful API development with ASP.NET Core, CRUD operations, and HTTP best practices" }
    ],
    "Databases & Caching": [
      { name: "MySQL, PostgreSQL, SQLite", description: "Relational database design, optimization, and management" },
      { name: "LiteDB, Redis", description: "Embedded NoSQL database and high-performance caching solutions" }
    ],
    "Operating Systems & Architectures": [
      { name: "Windows, Linux (WSL)", description: "Cross-platform development on Windows, Linux, and WSL environments" },
      { name: "ARM64, AMD64", description: "Multi-architecture application development and deployment" }
    ],
    "Cloud Platforms": [
      { name: "Microsoft Azure", description: "App Services, Azure Functions, Azure SQL Database, infrastructure management" },
      { name: "Amazon Web Services (AWS)", description: "EC2, S3, Lambda, RDS, and scalable cloud application deployment" }
    ],
    "Networking & Security": [
      { name: "SSH, TLS, SSL, JWT", description: "Secure protocols for remote access, encryption, and authentication" },
      { name: "MobaXterm, PuTTY", description: "Terminal emulators for remote server management and SSH" }
    ],
    "Development & Debugging Tools": [
      { name: "Fork (Git Client)", description: "Visual Git repository management, branching, and merging" },
      { name: "Hercules (Serial/TCP Debugging)", description: "Serial port and TCP/IP debugging for embedded systems" }
    ],
    "Version Control & CI/CD": [
      { name: "Git, Bitbucket, GitHub", description: "Version control systems and repository hosting platforms" },
      { name: "Jenkins", description: "Automated CI/CD pipelines for continuous integration and deployment" }
    ],
    "API Development & Testing": [
      { name: "Swagger, Postman", description: "API documentation with OpenAPI/Swagger and comprehensive testing" },
      { name: "REST, SOAP", description: "RESTful and SOAP web service design and implementation" }
    ],
    "Containerization": [
      { name: "Docker", description: "Container creation, deployment, and production environment management" },
      { name: "Docker Compose, Registries", description: "Multi-container orchestration and private container registry management" }
    ],
    "Web Communication": [
      { name: "HTTPS, SFTP, WebSockets", description: "Secure protocols for HTTP, file transfer, and real-time bidirectional communication" },
      { name: "gRPC, MQTT, XMLRPC", description: "Modern RPC frameworks and lightweight messaging for IoT applications" }
    ],
    "Front-End Development": [
      { name: "Vue 3, JavaScript, Tailwind", description: "Vue 3 Composition API, JavaScript, and Tailwind CSS for responsive UIs" },
      { name: "HTML5, CSS3, Responsive Design", description: "Modern web standards and mobile-first responsive design principles" }
    ],
    "Project Management & Docs": [
      { name: "Jira, Confluence", description: "Project tracking, issue management, and team documentation" },
      { name: "Bitbucket, GitHub, Jenkins, Nexus", description: "Source control, CI/CD automation, and artifact management" }
    ]
  },
  
  certifications: [
    "AWS Certified Developer Associate",
    "Docker Certified Associate",
    "MongoDB Certified Developer",
    "Scrum Master Certification"
  ],
  
  languages: {
    "Portuguese": "Native",
    "English": "Fluent",
    "Spanish": "Intermediate",
    "French": "Basic"
  }
};

const initials = computed(() => {
  const names = profile.name.split(' ');
  return names.length >= 2 
    ? `${names[0][0]}${names[names.length - 1][0]}`
    : names[0].substring(0, 2).toUpperCase();
});
</script>

<style scoped>
/* Smooth animations for cards */
.bg-modal-color-gradient {
  transition: transform 0.2s ease-in-out;
}

.bg-modal-color-gradient:hover {
  transform: translateY(-2px);
}
</style>
