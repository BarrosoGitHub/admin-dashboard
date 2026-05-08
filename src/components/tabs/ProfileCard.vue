<template>
  <div class="p-6 space-y-6">
    <!-- Header Card (avatar + contact + summary) -->
    <div class="bg-modal-color-gradient rounded-2xl p-8 border border-color shadow-lg overflow-hidden relative">
      <!-- Subtle accent orb -->
      <div class="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
        <!-- Avatar -->
        <div class="w-28 h-28 flex-shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/20">
          {{ initials }}
        </div>
        <!-- Name / title / contact -->
        <div class="flex-1 min-w-0 text-center md:text-left">
          <h1 class="text-2xl font-bold text-color mb-0.5">{{ profile.name }}</h1>
          <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4">{{ profile.title }}</p>
          <div class="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 flex-shrink-0 text-indigo-500 dark:text-indigo-400/70" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              <span>{{ profile.email }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 flex-shrink-0 text-indigo-500 dark:text-indigo-400/70" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              <span>{{ profile.phone }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 flex-shrink-0 text-indigo-500 dark:text-indigo-400/70" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span>{{ profile.location }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 flex-shrink-0 text-indigo-500 dark:text-indigo-400/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
                <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
      <!-- Divider -->
      <div class="mt-6 pt-6 border-t border-color">
        <div class="flex items-center gap-2.5 mb-3">
          <div class="w-1 h-4 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
          <h3 class="text-sm font-bold text-color">Professional Summary</h3>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ profile.summary }}</p>
      </div>
    </div>

    <!-- Skills Section -->
    <div id="skills" class="bg-modal-color-gradient rounded-2xl p-6 border border-color shadow-lg">
      <div class="flex items-center gap-2.5 mb-6">
        <div class="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
        <h3 class="text-lg font-bold text-color">Technical Skills</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <div v-for="(skillCategory, category) in profile.skills" :key="category"
             class="rounded-xl p-4 border border-color bg-white/2 hover:border-indigo-500/25 hover:bg-indigo-500/5 transition-all duration-300">
          <h4 class="text-xs font-bold text-indigo-600/80 dark:text-indigo-400/80 uppercase tracking-widest mb-3">{{ category }}</h4>
          <div class="space-y-1.5">
            <div v-for="(skill, idx) in skillCategory" :key="idx" class="group relative">
              <div class="flex items-start text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 cursor-help py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-white/5">
                <span class="w-1 h-1 rounded-full bg-indigo-500/50 mr-2 mt-1.5 flex-shrink-0"></span>
                <span class="flex-1 leading-tight">{{ skill.name }}</span>
              </div>
              <!-- Tooltip -->
              <div class="absolute left-0 top-full mt-1 w-full bg-white dark:bg-gray-900 border border-indigo-500/20 dark:border-indigo-500/20 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300 shadow-xl z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                {{ skill.description }}
                <div class="absolute -top-1 left-4 w-2 h-2 bg-white dark:bg-gray-900 border-l border-t border-indigo-500/20 transform rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Work Experience and Education/Languages Section - Side by Side -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Experience Section -->
      <div id="experience" class="bg-modal-color-gradient rounded-2xl p-6 border border-color shadow-lg">
        <div class="flex items-center gap-2.5 mb-5">
          <div class="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
          <h3 class="text-lg font-bold text-color">Work Experience</h3>
        </div>
        <div class="space-y-4">
          <div v-for="(job, index) in profile.experience" :key="index" class="group border-l-2 border-indigo-500/30 pl-4 hover:border-indigo-500/70 transition-all duration-300 cursor-pointer p-2 rounded-r-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/5">
            <div class="flex justify-between items-start mb-1">
              <div class="flex-1">
                <h4 class="text-sm font-bold text-color">{{ job.position }}</h4>
                <p class="text-xs text-indigo-600/80 dark:text-indigo-400/80 font-medium">{{ job.company }}</p>
              </div>
              <span class="text-xs text-gray-500 ml-4 flex-shrink-0">{{ job.period }}</span>
            </div>
            <ul class="space-y-1 max-h-0 opacity-0 group-hover:max-h-96 group-hover:opacity-100 transition-all duration-700 overflow-hidden">
              <li v-for="(responsibility, idx) in job.responsibilities" :key="idx" class="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span class="w-1 h-1 rounded-full bg-indigo-500/50 mt-1.5 flex-shrink-0"></span>
                {{ responsibility }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Education and Languages Column -->
      <div class="space-y-6">
        <!-- Education Section -->
        <div id="education" class="bg-modal-color-gradient rounded-2xl p-6 border border-color shadow-lg">
          <div class="flex items-center gap-2.5 mb-5">
            <div class="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
            <h3 class="text-lg font-bold text-color">Education</h3>
          </div>
          <div class="space-y-4">
            <div v-for="(edu, index) in profile.education" :key="index" class="group border-l-2 border-indigo-500/30 pl-4 hover:border-indigo-500/70 transition-all duration-300 cursor-pointer p-2 rounded-r-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/5">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h4 class="text-sm font-bold text-color">{{ edu.degree }}</h4>
                  <div class="relative h-5">
                    <p class="text-xs text-indigo-600/80 dark:text-indigo-400/80 font-medium absolute group-hover:opacity-0 transition-all duration-300">{{ edu.institution }}</p>
                    <p v-if="edu.gpa" class="text-xs text-gray-500 dark:text-gray-400 absolute opacity-0 group-hover:opacity-100 transition-all duration-300">{{ edu.gpa }}</p>
                  </div>
                </div>
                <span class="text-xs text-gray-500 ml-4 flex-shrink-0">{{ edu.year }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Languages Section -->
        <div id="languages" class="bg-modal-color-gradient rounded-2xl p-6 border border-color shadow-lg">
          <div class="flex items-center gap-2.5 mb-5">
            <div class="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
            <h3 class="text-lg font-bold text-color">Languages</h3>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div v-for="(proficiency, language) in profile.languages" :key="language"
                 class="text-center p-3 rounded-xl border border-color hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all duration-200">
              <p class="text-sm font-bold text-color">{{ language }}</p>
              <p class="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-0.5">{{ proficiency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Certifications Section — only render when there is data -->
    <div v-if="profile.certifications.length" id="certifications" class="bg-modal-color-gradient rounded-2xl p-6 border border-color shadow-lg">
      <div class="flex items-center gap-2.5 mb-5">
        <div class="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
        <h3 class="text-lg font-bold text-color">Certifications & Achievements</h3>
      </div>
      <ul class="space-y-3">
        <li v-for="(cert, index) in profile.certifications" :key="index" 
            class="flex items-start text-gray-400 hover:text-color transition-colors duration-200">
          <svg class="w-5 h-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ cert }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const profile = {
  name: "Diogo Miguel Rebelo Barroso",
  title: "Senior Software Engineer | Full Stack Developer",
  email: "rebelo.barroso@gmail.com",
  phone: "+351 91 599 4978",
  location: "Almada, Setúbal",
  linkedin: "https://www.linkedin.com/in/diogo-barroso-3872a81b3/",
  summary: "Experienced software engineer with a robust background in backend development and current expertise as an Embedded System Engineer at Petrotec. Proficient in designing and implementing efficient and scalable solutions, with extensive experience working with Linux, Docker, and .NET technologies. I specialize in backend development using .NET, with strong proficiency in Linux environments and embedded systems like Toradex boards. I leverage Docker for containerization and ensure secure communications through SSH and encryption. My experience includes developing APIs, implementing HTTPS, and using WebSockets for efficient data exchange, as well as MQTT for reliable real-time messaging.",

  experience: [
    {
      position: "Embedded Sys. Engineer / Developer",
      company: "Petrotec",
      period: "Feb 2024 – Present",
      responsibilities: [
        "Backend development with .NET, focusing on Linux-based and embedded systems (Toradex Apalis, ARM64).",
        "Containerization of microservices with Docker; deployment and management on ARM64 hosts.",
        "Secure communications through SSH, TLS/SSL encryption, and JWT authentication.",
        "Designed and developed RESTful APIs, WebSocket gateways, and MQTT messaging for real-time data exchange.",
        "Integration of hardware interfaces on microcomputer boards via custom device drivers for industrial energy-sector applications."
      ]
    },
    {
      position: "Experienced Programmer",
      company: "Deloitte",
      period: "Feb 2022 – Feb 2024",
      responsibilities: [
        "Collaborated with cross-functional development teams to design and deliver scalable software applications.",
        "Integrated third-party APIs to enhance software interoperability across platforms.",
        "Streamlined CI/CD pipelines, enabling faster release cycles and improved code reliability."
      ]
    },
    {
      position: "Teacher",
      company: "E.P.A",
      period: "Feb 2020 – Feb 2022",
      responsibilities: [
        "Delivered lesson plans on Electricity, Electronics, and Digital Systems.",
        "Guided laboratory sessions reinforcing foundational electronics concepts with adherence to safety protocols.",
        "Assessed student progress through assignments, projects, and exams."
      ]
    },
    {
      position: "Estimator",
      company: "Sotécnica – Lisbon Airport",
      period: "Mar 2019 – Aug 2019",
      responsibilities: [
        "Prepared cost analyses and project bids for airport electrical systems.",
        "Formulated quantity takeoffs and material estimates for large-scale electrical infrastructure projects."
      ]
    }
  ],

  education: [
    {
      degree: "Masters in Electrical Engineering and Computers",
      institution: "Instituto Politécnico de Setúbal",
      year: "2020 – 2022",
      gpa: "3.5 GPA (17.5 Average)"
    }
  ],

  skills: {
    "Backend Development": [
      { name: ".NET Core (up to version 9)", description: "Scalable microservices and distributed systems with .NET Core through version 9" },
      { name: "Microservices", description: "Designing and deploying independently deployable services with REST, WebSockets, and MQTT" }
    ],
    "Containerization": [
      { name: "Docker", description: "Container creation, deployment, and production environment management on ARM64 and AMD64 hosts" },
      { name: "Docker Compose & Registries", description: "Multi-container orchestration with Compose and private container registry management via Nexus" }
    ],
    "Operating Systems & Architectures": [
      { name: "Windows, Linux (incl. WSL)", description: "Cross-platform development and administration on Windows, Linux, and WSL environments" },
      { name: "ARM64, AMD64", description: "Multi-architecture builds and deployments, including Toradex Apalis (iMX8) SOM boards" }
    ],
    "Networking & Security": [
      { name: "SSH, TLS, SSL, JWT", description: "Secure remote access, encrypted transport, and token-based authentication" },
      { name: "MobaXterm, PuTTY", description: "Terminal emulators used for remote server management and SSH tunneling" }
    ],
    "Web Communication": [
      { name: "HTTPS, WebSockets", description: "Secure HTTP and full-duplex real-time communication for dashboard and device APIs" },
      { name: "MQTT", description: "Lightweight publish/subscribe messaging protocol for reliable IoT and embedded real-time messaging" }
    ],
    "API Development & Testing": [
      { name: "Swagger / OpenAPI", description: "Interactive API documentation and contract-first API design" },
      { name: "Postman", description: "API testing, environment management, and automated request collections" }
    ],
    "Databases & Caching": [
      { name: "MySQL", description: "Relational database design, queries, and administration" },
      { name: "Redis", description: "In-memory data store used for high-performance caching and pub/sub messaging" }
    ],
    "Cloud Platforms": [
      { name: "Azure DevOps", description: "CI/CD pipelines, repos, boards, and release management on Azure DevOps" },
      { name: "Azure Functions", description: "Serverless compute on Microsoft Azure for event-driven microservices and integrations" }
    ],
    "Version Control & CI/CD": [
      { name: "Bitbucket, GitHub", description: "Git repository hosting, pull requests, and branching strategies" },
      { name: "Jenkins, Nexus", description: "Automated CI/CD pipelines and artifact repository management for containerized releases" }
    ],
    "Development & Debugging Tools": [
      { name: "Fork (Git Client)", description: "Visual Git repository management, branching, merging, and conflict resolution" },
      { name: "Hercules (Serial/TCP)", description: "Serial port and TCP/IP debugging tool used extensively for embedded systems diagnostics" }
    ],
    "Project Management & Docs": [
      { name: "Jira, Confluence", description: "Agile project tracking, sprint planning, issue management, and team documentation" }
    ]
  },

  certifications: [],

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
