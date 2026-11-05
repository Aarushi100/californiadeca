/* ADMIN: edit this file to add, change, or remove content. Keep the commas and quotes.
   Everything marked (Sample) is placeholder content, not a real listing. Replace before launch. */
window.HUB = {
  contact: {
    // Paste a Formspree (or similar) endpoint here to make the contact form send mail, e.g. "https://formspree.io/f/xxxxxxx"
    formEndpoint: "",
    email: "hub@example.org",
    social: [["Instagram", "https://www.instagram.com/"], ["LinkedIn", "https://www.linkedin.com/"]]
  },
  competeGroups: ["Principles", "Individual Series", "Team Decision Making", "Business Operations Research", "Project Management", "Integrated Marketing Campaigns", "Professional Selling and Consulting"],
  competeKinds: ["Preparation guide", "Performance indicators", "Practice questions and exam prep", "Roleplay and written event resources"],
  opps: [
    {id:"i1", cat:"internship", title:"Marketing Intern (Sample)", org:"Example Company", desc:"Example listing showing how an internship appears. Replace with a verified opportunity.", field:"Marketing", elig:"Local high school students", grades:["11","12"], comp:"Paid (sample)", paid:true, loc:"Los Angeles, CA", mode:"In person", deadline:"2027-03-15", url:"https://example.org/apply", verified:"2026-11-01"},
    {id:"i2", cat:"internship", title:"Virtual Finance Shadowing (Sample)", org:"Example Advisory", desc:"Example remote career exploration program.", field:"Finance", elig:"Open to California students", grades:["10","11","12"], comp:"Unpaid (sample)", paid:false, loc:"Remote", mode:"Remote", deadline:"2027-02-01", url:"https://example.org/apply", verified:"2026-11-01"},
    {id:"i3", cat:"internship", title:"Nonprofit Operations Intern (Sample)", org:"Example Foundation", desc:"Example nonprofit internship listing.", field:"Nonprofit", elig:"Juniors and seniors", grades:["11","12"], comp:"Paid (sample)", paid:true, loc:"San Diego, CA", mode:"In person", deadline:"2027-04-20", url:"https://example.org/apply", verified:"2026-11-01"},
    {id:"u1", cat:"university", title:"Entrepreneurship Summer Program (Sample)", org:"Example University", desc:"Example summer program for business and entrepreneurship.", field:"Business", elig:"Rising juniors and seniors", grades:["10","11"], comp:"Tuition (sample)", paid:false, loc:"Berkeley, CA", mode:"In person", deadline:"2027-02-28", url:"https://example.org/apply", verified:"2026-11-01"},
    {id:"u2", cat:"university", title:"STEM Leadership Academy (Sample)", org:"Example College", desc:"Example STEM and leadership program.", field:"STEM", elig:"All California high schoolers", grades:["9","10","11","12"], comp:"Free (sample)", paid:false, loc:"Remote", mode:"Remote", deadline:"2027-05-01", url:"https://example.org/apply", verified:"2026-11-01"},
    {id:"u3", cat:"university", title:"Business Scholarship (Sample)", org:"Example Scholarship Fund", desc:"Example scholarship for college-bound seniors.", field:"Scholarship", elig:"Graduating seniors", grades:["12"], comp:"Award (sample)", paid:false, loc:"Statewide", mode:"Remote", deadline:"2027-01-31", url:"https://example.org/apply", verified:"2026-11-01"}
  ],
  funding: [
    {title:"Chapter Starter Grant (Sample)", org:"Example Fund", amount:"Up to $500", elig:"Chapters with fewer than 20 members", req:"One-page budget and project plan", deadline:"2027-03-01"},
    {title:"Local Business Sponsorship (Sample)", org:"Example Sponsor Program", amount:"Varies", elig:"Any chapter with advisor sign-off", req:"Sponsorship proposal and logo", deadline:"Rolling"},
    {title:"Conference Travel Grant (Sample)", org:"Example Fund", amount:"Up to $300", elig:"Chapters traveling over 100 miles", req:"Travel budget and roster", deadline:"2027-02-10"}
  ],
  templates: ["Sponsorship proposal", "Grant application", "Chapter budget"],
  // All events are online. type: "Presidents Council", "Workshop", "Officer Q&A", "Competition Prep"
  events: [
    {d:"2026-12-03", time:"6:30 PM PT", type:"Presidents Council", t:"Presidents Council Monthly Meeting (Sample)", where:"Zoom", url:"https://example.org/join"},
    {d:"2026-12-10", time:"7:00 PM PT", type:"Officer Q&A", t:"Ask the State Officers (Sample)", where:"Zoom", url:"https://example.org/join"},
    {d:"2027-01-14", time:"6:30 PM PT", type:"Workshop", t:"Chapter Recruitment Workshop (Sample)", where:"Google Meet", url:"https://example.org/join"},
    {d:"2027-01-21", time:"7:00 PM PT", type:"Competition Prep", t:"Roleplay Practice Night (Sample)", where:"Zoom", url:"https://example.org/join"},
    {d:"2027-02-04", time:"6:30 PM PT", type:"Presidents Council", t:"Presidents Council Monthly Meeting (Sample)", where:"Zoom", url:"https://example.org/join"}
  ],
  council: "The Presidents Council is a group of chapter presidents who meet online to share ideas and give feedback to the state officer team. (Sample description. Replace with the real purpose, eligibility, and how to join.)"
};
