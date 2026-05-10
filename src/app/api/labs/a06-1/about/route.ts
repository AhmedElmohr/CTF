import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/labs/a06-1/about
 *
 * Public "About Us" page that contains OSINT data.
 * The CEO's bio mentions his dog "Max" — which is the answer
 * to his security question.
 */
export async function GET() {
  return NextResponse.json({
    company: "SecureCorp Inc.",
    founded: 2010,
    headquarters: "Austin, Texas",
    team: [
      {
        name: "Mark Becker",
        title: "Chief Executive Officer (CEO)",
        username: "m.becker",
        email: "m.becker@securecorp.local",
        bio: "Mark founded SecureCorp in 2010 with a vision to revolutionize enterprise security. When he's not in the boardroom, Mark enjoys hiking the trails near Lake Travis with his loyal Golden Retriever, Max. An avid pilot, he often flies his Cessna 172 on weekends. Mark believes that a secure company is a happy company!",
        socialMedia: {
          twitter: "@markbecker_ceo",
          linkedin: "linkedin.com/in/mark-becker-securecorp",
        },
      },
      {
        name: "Sarah Jenkins",
        title: "Chief Technology Officer (CTO)",
        username: "s.jenkins",
        email: "s.jenkins@securecorp.local",
        bio: "Sarah leads our engineering teams with over 15 years of experience in system architecture. She is passionate about building scalable, resilient infrastructure and frequently speaks at international tech conferences. In her spare time, she mentors young women in STEM programs.",
        socialMedia: {
          twitter: "@sarahj_tech",
          linkedin: "linkedin.com/in/sarah-jenkins-cto",
        },
      },
      {
        name: "David Chen",
        title: "VP of Engineering",
        username: "d.chen",
        email: "d.chen@securecorp.local",
        bio: "David manages the platform engineering team and has been instrumental in migrating our infrastructure to Kubernetes. He's a contributor to several open-source projects and loves building mechanical keyboards.",
      },
    ],
  });
}
