import Icon from "../Icon";

const STEPS = [
  {
    num: "01",
    title: "Tell us where you want to go",
    description:
      "Take a quick quiz or describe your career goal in your own words. Tell CareerForge about your interests, experience, and what you want to achieve.",
  },
  {
    num: "02",
    title: "Get your roadmap",
    description:
      "CareerForge creates a personalized learning path with skills, milestones, resources, and practical projects tailored to your goal.",
  },
  {
    num: "03",
    title: "Learn, practice, and grow",
    description:
      "Follow your roadmap, build skills through practical work, track your progress, and adjust your path as you grow.",
  },
  {
    num: "04",
    title: "Move toward your goal",
    description:
      "Turn your progress into real opportunities, whether that is a job, career change, certification, project, or another goal you have set for yourself.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="pf-how-it-works">
      <div className="inner">
        <div style={{ textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>
            <Icon icon="lucide:map" size={14} />
            How it works
          </div>
          <h2
            className="section-title"
            style={{
              maxWidth: "100%",
              textAlign: "center",
              margin: "0 auto 16px",
            }}
          >
            Four steps to your next chapter
          </h2>
          <p
            className="section-sub"
            style={{
              maxWidth: 480,
              textAlign: "center",
              margin: "0 auto",
              marginBottom: 0,
            }}
          >
            No fluff, no confusion — just a clear way to turn your goal into a
            plan.
          </p>
        </div>

        <div className="steps-grid">
          {STEPS.map((step) => (
            <div key={step.num} className="step">
              <div className="step-num">{step.num}</div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
