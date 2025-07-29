import SubsectionTech from "./SubsectionTech";

const AllSkills = [
  ...new Set(
    [
      ...SubsectionTech.Language,
      ...SubsectionTech.Android,
      ...SubsectionTech.Frontend,
      ...SubsectionTech.Backend,
      ...SubsectionTech.Design,
      ...SubsectionTech.DevOps,
      ...SubsectionTech.Database,
      ...SubsectionTech.IOS,
      ...SubsectionTech.Cloud,
      ...SubsectionTech.Multiplatfotm,
      ...SubsectionTech.GameDev,
      ...SubsectionTech.Containerisation,
      ...SubsectionTech.Desktop,
      ...[
        "Cybersecurity",
        "Metasploit",
        "Dark Web",
        "Ethical Hacking",
        "ML/AI",
        "TensorFlow",
        "PyTorch",
        "Keras",
        "Scikit-Learn",
        "NLTK",
        "SpaCy",
        "Gensim",
        "Jupyter",
        "Pandas",
        "Numpy",
        "Seaborn",
        "Matplotlib",
        "Plotly",
        "Bokeh",
        "Holo Views",
        "Intake",
        "Apache Spark",
        "Tableau",
        "Power BI",
        "D3js",
        "Hadoop",
        "AWS",
        "Android",
        "IOS",
        "Linux",
        "CSS",
        "Redux"
      ],
    ].sort()
  ),
];

export default AllSkills;
