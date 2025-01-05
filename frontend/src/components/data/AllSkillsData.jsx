const AllSkills = [
  "Java",
  "Javascript",
  "TypeScript",
  "Python",
  "Django REST",
  "C++",
  "C",
  "C/C++",
  "GraphQL",
  "Appolo",
  "REST API",
  "Microservices",
  "Spring Framework",
  "Kotlin",
  "PHP",
  "C#",
  "Ruby",
  "Rust",
  "GO",
  "Swift",
  "Dart",
  "Objective-C",
  "Perl",
  "R",
  "Ada",
  "Lisp",
  "D",
  "Vala",
  "Crystal",
  "Nim",
  "Lua",
  "SQL",
  "Haskell",
  "Scheme",
  "Erlang",
  "XML",
  "F#",
  "OCaml",
  "Scala",
  "Clojure",
  "Bash/Shell",
  "Powershell",
  "TCL",
  "Groovy",
  "Assembly",
  "Julia",
  "MATLAB",
  "React",
  "Angular",
  "Vue",
  "Svelte",
  "Nextjs",
  "Transformers",
  "Diffusion",
  "Nuxt",
  "Remix",
  "Preact",
  "General Adversarial Networks (GANs)",
  "Explanatory Data Analysis (EDA)",
  "Alpine",
  "HTML/CSS",
  // JavaScript/TypeScript
  "Node.js",
  "Express.js",
  "NestJS",
  "Koa.js",
  "Fastify",
  "AdonisJS",
  "Hapi.js",
  "Sails.js",
  // Python
  "Django",
  "Flask",
  "FastAPI",
  "Pyramid",
  "Tornado",
  "Bottle",
  // Ruby
  "Ruby on Rails",
  "Sinatra",
  "Hanami",
  // Java
  "Spring Boot",
  "Micronaut",
  "JHipster",
  "Quarkus",
  "Spark Java",
  "Dropwizard",
  // PHP
  "Laravel",
  "Symfony",
  "CodeIgniter",
  "Yii",
  "Phalcon",
  "Slim",
  "Zend Framework (Laminas)",
  // C#/.NET
  "ASP.NET Core",
  "NancyFx",
  "ServiceStack",
  // Go
  "Gin",
  "Echo",
  "Fiber",
  "Beego",
  "Revel",
  // Elixir
  "Phoenix",
  // C++
  "Crow",
  "CppCMS",
  "Drogon",
  // Rust
  "Rocket",
  "Actix",
  "Axum",
  // Perl
  "Dancer",
  "Mojolicious",
  "Catalyst",
  // Scala
  "Play Framework",
  "Akka HTTP",
  // Kotlin
  "Ktor",
  "Javalin",
  // Haskell
  "Yesod",
  "Scotty",
  "Snap",
  "Figma",
  "Adobe XD",
  "Sketch",
  "Balsamiq",
  "InVision",
  "Proto.io",
  "Mockplus",
  "UXPin",
  "FlowMap",
  "Framer",
  "Miro",
  "Justinmind",
  "Illustrator",
  "Webflow",
  "Craft",
  "Lucidchart",
  "Photoshop",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "Terraform",
  "Ansible",
  "Gitlab CI",
  "Puppet",
  "CircleCI",
  "Travis CI",
  "Bamboo",
  "Team City",
  "Go CD",
  "Spinnaker",
  "Harness",
  "Buddy",
  "Codefresh",
  "Semaphore",
  "Azure DevOps",
  "Github Actions",
  "BitBucket Pipeline",
  "AWS CodePipeline",
  "Google Cloud Build",
  "SQLite",
  "MySQL",
  "IBM DB2",
  "CockroachDB",
  "Oracle DB",
  "MariaDB",
  "VoltDB",
  "YugaByteDB",
  "TimescaleDB",
  "PlanetScaleDB",
  "NeonDB",
  "PostgreSQL",
  "DynamoDB",
  "MongoDB",
  "Google Firebase",
  "Supabase",
  "Neo4j",
  "Redis",
  "CouchDB",
  "Cassandra",
  "Android",
  "IOS",
  "Microsoft SQL Server",
  "Amazon DocumentDB",
  "Amazon Aurora",
  "Amazon RDS",
  "Sybase",
  "TIBCO Data Visualization",
  "MemSQL",
  "CouchBase",
  "RethinkDB",
  "IBM Cloudant",
  "Riak",
  "Aerospike",
  "Oracle NoSQL DB",
  "Google Bigtable",
  "HyperTable",
  "Amazon Neptune",
  "OrientDB",
  "JanusGraph",
  "Drupal",
  "Reverse Engineering",
  "TigerGraph",
  "Cayley",
  "Graphite",
  "Open TSDB",
  "Prometheus",
  "RRDtool",
  "Git",
  "GitLab",
  "SAP HANA",
  "Firebird",
  "Percona Server",
  "Google Cloud SQL",
  "Azure CosmosDB",
  "ArangoDB",
  "Memgraph",
  "Dgraph",
  "PineConeDB",
  "MilvusDB",
  "InfluxDB",
  "DolphinDB",
  "MemcachedDB",
  "KeyDB",
  "FaunaDB",
  "SurrealDB",
  "Hbase",
  "ScyllaDB",
  "Datasax",
  "Amazon Timestream",
  "Amazon Redshift",
  "Apache Ignite",
  "Foundation DB",
  "Apache Drill",
  "TiDB",
  "ElasticSearch",
  "Apache Solr",
  "Algolia",
  "MeiliSearch",
  "Hazelcast",
  "Tarantool",
  "Google Spanner",
  "NuoDB",
  "ObjectDB",
  "Versant",
  "JetpakCompose",
  "Amazon Web Services (AWS)",
  "Microsoft Azure",
  "Google Cloud Platform (GCP)",
  "Kotlin Multiplatform (KMP)",
  "Xamarin",
  "React-Native",
  "Cordova",
  "MAUI",
  "Ionic",
  "NativeScript",
  "Framework7",
  "Wordpress",
  "Natural Language Processing (NLP)",
  "Computer Vision",
  "Neural Networks",
  "MLOps",
  "Deep Learning",
  "Cryptography",
  "Ethical Hacking",
  "Kafka",
  "RabbitMQ",
  "Mosquito",
  "D3js",
  "ActiveMQ",
  "Mocha",
  "Chai",
  "VLAN",
  "Pandas",
  "TensorFlow",
  "Pytorch",
  "Scikit-Learn",
  "Extract Transform Load (ETL)",
  "Cuda",
  "Seaborn",
  "Matplotlib",
  "Excell",
  "JPA",
  "Jason Web Tokens (JWT)",
  "OAuth",
  "Auth2",
  "Social Engineering",
  "Reconnaissance",
  "Frensics",
  "Metasploit",
  "PowerBI",
  "Tableu",
  "Arduino",
  "Linux",
  "WAN",
  "Spanning Tree Protocol",
  "IPV4 & IPV6 protocols",
  "Subnetting",
  "Virtual Private Networks (VPN)",
  "CISCO",
  "Routers",
  "Switches",
  "Firewalls",
  "Huawei ",
  "Unity (C#)",
  "Unreal Engine (C++",
  "BluePrints)",
  "Godot Engine (GDScript, C#,C++)",
  "Cry Engine(C++)",
  "Game Maker Studio (GML)",
  "Amazon Lamberyard",
  "Pytest",
  "Unit Testing",
  "Integration Testing",
  "Jest",
  "Phaser.js",
  "LibGDx",
  "Mono Game",
  "PyGame",
  "Corona SDK /Solar 2D",
  "Defold",
  "SpriteKit",
  "Xamarin+MonoGame",
  "Three.js",
  "Babylon.js",
  "PlayCanvas",
  "CreateJS",
  "MelonJs",
  "A-Frame",
  "Vuforia",
  "ARkit",
  "ARCore",
  "Flutter",
  "Qt (C++)",
  "Flutter-Flow",
  "wxWidgets (C++)",
  "Java Swing (Java)",
  "JavaFX (Java)",
  "Standard Widget Toolkit (Java)",
  "PyQt (Python)",
  "Kivy (Python)",
  "Tkinter (Python)",
  "wxPython (Python)",
  "Cocoa (Swift/Objective-C)",
  "AppKit (Swift/Objective-C)",
  "GTK",
  "Electron (JavaScript)",
  "Node-WebKit (NW/JavaScript)",
  "Tauri (JavaScript/Rust)",
  "Delphi",
  "Xamarim.Forms",
  "Cocoa Touch",
  "Windows Presentation Foundation (WPF/C#)",
  "WinForms (C#)",
  "Universal Windows Platform (UWP/C#)",
  "Avalonia (C#/.NET Framework)",

  // other
  "Alechmy",
  "ORM",
  "Object Oriented Programming (OOP)",
  "Tortoise",
  "Payment Integration",
  "Payment Gateway",
  "Mpesa Daraja API",
  "PayTM",
  "Brave",
  "Paypal",
  "Google Pay",
  "Google Ads",
  "Prisma ORM",
  "Digital Wallet",
  "Cryptocurrency",
  "Bitcoin",
  "Etherium",
  "Binary Trading",
  "Bots",
  "Bot Integration",
  "Trading Bots",
  "Forex",
  "Binance",
  "Data Entry",
  "Data Visualisation",
  "Raspberry Pi",
  "Numpy",
  "Search Engine Optimisation (SEO)",
  "Selenium",
  "Web Scraping",
  "Automation",
  "Razor Pay",
  "CI/CD",
  "Maxi Cash",
  "Crypto Wallet",
  "Secure Socket Layer (SSL)",
  "Programming Logic Unit (PLU)",
  "Information Technology Intern",
  "Computer Networks Specialist",
  "Software Engineer ",
  "Software Developer",
  "Infrastructure Engineer",
  "Machine Learning Engineer",
  "Machine Learning Intern",
  "Data Science Engineer ",
  "IT Help Desk",
  "Data Entry Specialist",
  "Data Science Intern ",
  "Data Analyst ",
  "System Analyst",
  "DevOps Engineer",
  "Java/Kotlin Developer",
  "Powershell Developer",
  "Powershell Engineer",
  "Bash Scripting Engineer",
  "Shell Scripting Engineer",
  "Bash/Shell Scripting Engineer",
  "Cloud Engineer",
  "Cordova Developer",
  "Ionic Developer",
  "Backend Developer",
  "Golang Developer",
  "Senior Software Engineer",
  "Senior Machine Learning Engineer",
  "Computer Vison Engineer",
  "NLP Engineer",
  "Game Application Developer ",
  "Game Developer (Unreal Engine C++)",
  "Game Developer (Unity C#)",
  "Cybersecurity Engineer",
  "UI/UX Designer ",
  "Graphics Designer",
  "Graphics Engineer",
  "Computer Graphics Engineer",
  "IoT Engineer ",
  "Site Reliability Engineer ",
  "Infrastructure Engineer ",
  "Web3/Crypto/Blockchain Developer",
  "Platform Engineer",
  "Web Developer",
  "Docker/Kubernetes Engineer",
  "Docker Engineer",
  "Kubernetes Engineer",
  "Kotlin Developer",
  "Java Developer",
  "Java Software ",
  "Typescript Developer",
  "Containerisation/Orchestration Engineer",
  "Android Developer",
  "Software Engineer in Test",
  "Payment Integration Developer",
  "Database Administrator",
  "HTML/CSS/Javascript Developer",
  "MySQL Engineer",
  "Power Bi Specisalist",
  "Tableu Specialist",
  "D3js Developer",
  "Volunteer Software Developer",
  "IT Support Volunteer",
  "Payment Gateway Developer",
  "Javascript Developer",
  "Playstore Application Deployment Specialist",
  "Appstore Deployment Specialist",
  "GraphQL Developer",
  "MLOps Engineer",
  "Database Architect",
  "SQL Engineer",
  "Software Developer Intern",
  "ICT/IT Support Engineer",
  "Laravel Developer",
  "Python Django Developer",
  "Application Developer",
  "Arduino Engineer",
  "Arttificial Intelligence Engineer",
  "Raspberry Pi Engineer",
  "Linux Engineer",
  "Senior Linux Engineer",
  "Windows Application Developer",
  "Desktop Application Developer",
  "Frontend Developer",
  "FullStack Developer",
  "Python Developer",
  "IOS Developer",
  "Flutter Developer",
  "Kotlin Multiplatform Developer",
  "React Native Developer",
  "Zamarin Developer",
  "MUI Developer",
  "C++ Software Engineer",
  "C++  Developer",
  "Cuda Software Engineer",
  "React Developer",
  "Angular Developer",
  "Nodejs Developer",
  "Javascript/Typescript Developer",
  "PHP Developer",
  "Python Flask Developer",
  "Vuejs  Developer",
  "Nextjs Developer",
  "Svelte Developer",
  "Certified Ethical Hacker",
  "Ethical Hacker",
  "Crytographic Engineer",
  "Reverse Engineer",
  "Digital Forensics Engineer",
  "System Programmer",
  "System Administrator",
  "ICT/IT/CS Lecturer",
  "Generative AI Engineer",
  "Programming Logic Engineer (PLU)",
  "Orchestration Engineer",
  "Containerisation Engineer",
  "Deep Learning Engineer",
  "ICT/IT/CS Teacher",
  "Lead Backend Engineer",
  "Lead Fronted Developer",
  "CodeIgniter Developer",
  "Haskel Software Developer",
  "Coding Tutor",
  "ASP.NET Developer",
  "ASP.NET Core Engineer",
  "ServiceStack Developer",
  "Elixir Software Developer",
  "F# Software Engineer",
  "Nuxtjs Develper",
  "Remix Developer",
  "Apine Developer",
  "Preact Developer",
  "Erlang Developer",
  "Scala Developer",
  "Groovy Developer",
  "Perl Software Developer",
  "Swift Software Engineer",
  "Objective-C Software Engineer",
  "Fastify Software Developer",
  "Computer Virus Engineer",
  "Streamlit Developer",
  "ElectronJs Developer",
  "Python Software Engineer",
  "ML/AI Engineer",
  "Software Architect Engineer",
  "Lead Cloud Engineer",
  "Unity Game Developer",
  "Unreal Engine Game Developer",
  "Unity/Unreal Engine Game Engineer",
  "Lead Software Engineer",
  "Backend Engineer",
  "C# Software Engineer",
  "Senior Backend Engineer",
  "Senior Frontend Engineer",
  "Golang Software Engineer",
  "Rust Software Engineer",
  "Ruby On Rails Developer",
  "Symphony Developer",
  "Assembly Engineer",
  "CRM Software Developer",
  "Statistical Programmer",
  "Spring Boot Developer",
  "Robotics Engineer",
  "Technical ICT/IT Support ",
  "Argo CI/CD",
  "Machine Learning",
  "IoT",
  "NoSQL",
  "Web Development",
  "CSS",
  "UI/UX",
  "Containerisation",
  "Adobe",
  "Adobe PS",
  "Adobe Illustrator",
].sort();

export default AllSkills;
