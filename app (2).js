(function () {
  "use strict";
  var H = window.HUB, app = document.getElementById("app"), nav = document.getElementById("nav");
  var NAV = [["home","Home"],["compete","Compete"],["internships","Internships"],["university","University Programs"],["funding","Funding"],["connect","Connect"]];
  var saved = [], state = {}, query = "";
  try { saved = JSON.parse(localStorage.getItem("hub-saved") || "[]"); } catch (e) {}
  function persist() { try { localStorage.setItem("hub-saved", JSON.stringify(saved)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function fmt(d) { return new Date(d + "T12:00:00").toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"}); }
  function due(d) {
    if (!/^\d/.test(d)) return '<span class="due">' + esc(d) + "</span>";
    var n = Math.ceil((new Date(d + "T23:59:59") - new Date()) / 864e5);
    if (n < 0) return '<span class="due past">Closed</span>';
    return '<span class="due ' + (n <= 30 ? "soon" : "") + '">' + (n <= 30 ? "Closes in " + n + " days" : "Due " + fmt(d)) + "</span>";
  }
  var sample = '<p class="notice"><strong>Sample content.</strong> Listings are labeled examples, not real opportunities.</p>';
  function head(t, p) { return '<div class="pagehead"><div class="wrap"><h1>' + t + "</h1><p>" + p + "</p></div></div>"; }
  function wrap(h) { return '<div class="wrap"><section>' + h + "</section></div>"; }
  function oppRow(o) {
    var on = saved.indexOf(o.id) > -1;
    return '<li class="item"><div><h3><a href="#opp-' + o.id + '">' + esc(o.title) + '</a></h3><div class="meta">' + esc(o.org) + " · " + esc(o.loc) + " · " + esc(o.comp) + " · Grades " + o.grades.join(", ") + '</div></div><div class="side">' + due(o.deadline) + '<br><button class="save" data-save="' + o.id + '">' + (on ? "Saved" : "Save") + "</button></div></li>";
  }
  function resources() {
    var out = [];
    H.competeGroups.forEach(function (g) { H.competeKinds.forEach(function (k) { out.push({id: "r" + out.length, g: g, t: g + ": " + k}); }); });
    H.templates.forEach(function (t, i) { out.push({id: "t" + i, g: "Template", t: t}); });
    return out;
  }
  var RES = resources();
  function resRow(r) { return '<li class="item"><div><h3>' + esc(r.t) + '</h3><div class="meta">' + esc(r.g) + ' · Sample file</div></div><div class="side"><button class="save" data-dl="' + r.id + '">Download</button></div></li>'; }
  function select(key, label, opts) {
    return '<select data-f="' + key + '" aria-label="' + label + '"><option value="">' + label + "</option>" + opts.map(function (o) { return '<option value="' + esc(o) + '"' + (state[key] === o ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") + "</select>";
  }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }).sort(); }
  function board(cat) {
    var L = H.opps.filter(function (o) { return o.cat === cat; }), k = cat + ".";
    var R = L.filter(function (o) {
      return (!state[k+"pay"] || (state[k+"pay"] === "Paid") === o.paid) && (!state[k+"field"] || o.field === state[k+"field"]) &&
        (!state[k+"grade"] || o.grades.indexOf(state[k+"grade"]) > -1) && (!state[k+"mode"] || o.mode === state[k+"mode"]);
    }).sort(function (a, b) { return state[k+"sort"] === "Title" ? a.title.localeCompare(b.title) : a.deadline.localeCompare(b.deadline); });
    var f = '<div class="filters">' + (cat === "internship" ? select(k+"pay", "Pay", ["Paid", "Unpaid"]) : "") + select(k+"field", cat === "internship" ? "Industry" : "Subject", uniq(L.map(function (o) { return o.field; }))) + select(k+"grade", "Grade", ["9","10","11","12"]) + select(k+"mode", "Remote or in person", uniq(L.map(function (o) { return o.mode; }))) + select(k+"sort", "Sort: deadline", ["Title"]) + "</div>";
    return f + '<ul class="list">' + (R.map(oppRow).join("") || '<li class="item">No matches. Clear a filter and try again.</li>') + "</ul>";
  }
  function eventRows(list) {
    return '<ul class="list">' + list.map(function (e) { return '<li class="item"><div><h3>' + esc(e.t) + '</h3><div class="meta">' + esc(e.type) + " · " + esc(e.where) + " · " + esc(e.time) + '</div></div><div class="side"><span class="due">' + fmt(e.d) + '</span><br><a href="' + esc(e.url) + '" target="_blank" rel="noopener">Join link</a></div></li>'; }).join("") + "</ul>";
  }
  function fundRow(f) { return '<li class="item"><div><h3>' + esc(f.title) + '</h3><div class="meta">' + esc(f.org) + " · " + esc(f.amount) + "<br><strong>Eligibility:</strong> " + esc(f.elig) + "<br><strong>Requires:</strong> " + esc(f.req) + '</div></div><div class="side">' + due(f.deadline) + "</div></li>"; }
  function searchPage() {
    var q = query.toLowerCase(), has = function (s) { return s.toLowerCase().indexOf(q) > -1; };
    var o = H.opps.filter(function (x) { return has(x.title + x.org + x.desc + x.field); });
    var r = RES.filter(function (x) { return has(x.t); }), f = H.funding.filter(function (x) { return has(x.title + x.org + x.elig); });
    var e = H.events.filter(function (x) { return has(x.t + x.type); });
    return head("Search", "Across resources, opportunities, funding, and events.") + wrap('<form id="sf" class="filters"><input type="search" id="q" value="' + esc(query) + '" aria-label="Search the hub" style="flex:1;min-width:200px"><button class="btn">Search</button></form>' +
      "<h2>Opportunities (" + o.length + ')</h2><ul class="list">' + o.map(oppRow).join("") + "</ul><h2 style='margin-top:28px'>Resources (" + r.length + ')</h2><ul class="list">' + r.slice(0, 10).map(resRow).join("") + "</ul><h2 style='margin-top:28px'>Funding (" + f.length + ')</h2><ul class="list">' + f.map(fundRow).join("") + "</ul><h2 style='margin-top:28px'>Events (" + e.length + ")</h2>" + eventRows(e));
  }
  function contactForm() {
    return '<form id="cf" novalidate><label for="to">Send to</label><select id="to" name="recipient"><option>A state officer</option><option>The Presidents Council</option></select>' +
      '<label for="msg">Your message</label><textarea id="msg" name="message" rows="6" required></textarea>' +
      '<label for="rc">How can we reply? (optional)</label><input type="text" id="rc" name="reply_contact" placeholder="Leave blank to stay anonymous">' +
      '<div class="hp" aria-hidden="true"><label>Leave empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
      '<p class="meta">Name and email are not required. Do not include personal details you want to keep private.</p><button class="btn">Send message</button><p id="cs" role="status" class="meta"></p></form>';
  }
  var P = {
    home: function () {
      var up = H.events.slice(0, 3);
      return '<div class="intro"><div class="wrap"><h1>Your next opportunity starts here.</h1><p>Everything you need to compete, lead, and grow as a California DECA member.</p><form class="find" id="hf" role="search"><input id="hq" placeholder="Search resources, internships, programs" aria-label="Search the hub"><button class="btn">Search</button></form><div class="links"><a href="#compete">Explore resources</a><a href="#internships">Discover opportunities</a></div></div></div>' +
        '<div class="wrap"><section><h2>Where to start</h2><p class="sub">One State. More Opportunities.</p><ul class="list">' +
        [["compete","Compete","Event guides, performance indicators, practice questions, and roleplay resources."],["internships","Internships","Paid and unpaid internships open to high school students."],["university","University Programs","Summer programs and scholarships, filterable by grade, subject, and location."],["funding","Funding","Chapter grants, sponsorships, and proposal templates."],["connect","Connect","Online events, the Presidents Council, and an anonymous line to the state officers."]].map(function (x) { return '<li class="item"><div><h3><a href="#' + x[0] + '">' + x[1] + '</a></h3><div class="meta">' + x[2] + "</div></div></li>"; }).join("") + '</ul></section><section><h2>Featured opportunities</h2><p class="sub">Selected internships and programs.</p>' + sample + '<ul class="list">' + H.opps.slice(0, 3).map(oppRow).join("") + '</ul></section><section><h2>Upcoming online events</h2><p class="sub">Open to members statewide.</p>' + eventRows(up) + '<p><a href="#connect">See all events</a></p></section></div>';
    },
    compete: function () {
      var g = state.cg || "", q = (state.cq || "").toLowerCase();
      var R = RES.filter(function (r) { return (!g || r.g === g) && (!q || r.t.toLowerCase().indexOf(q) > -1); });
      return head("Compete", "Preparation resources for every event category.") + wrap(sample + '<div class="filters"><input type="search" id="cq" placeholder="Search resources" aria-label="Search resources" value="' + esc(state.cq || "") + '">' + select("cg", "All categories", H.competeGroups.concat(["Template"])) + '</div><ul class="list">' + (R.map(resRow).join("") || '<li class="item">No matches.</li>') + "</ul>");
    },
    internships: function () { return head("Internships", "Opportunities accessible to high school students.") + wrap(sample + board("internship")); },
    university: function () { return head("University Programs", "Summer programs, scholarships, and college preparation.") + wrap(sample + board("university")); },
    funding: function () { return head("Funding", "Grants and sponsorships for chapters, with eligibility and requirements.") + wrap(sample + '<ul class="list">' + H.funding.map(fundRow).join("") + '</ul><h2 style="margin-top:34px">Templates</h2><ul class="list">' + RES.filter(function (r) { return r.g === "Template"; }).map(resRow).join("") + "</ul>"); },
    connect: function () {
      return head("Connect", "Online events, the Presidents Council, and a direct line to the state officers.") + '<div class="wrap"><section>' + sample + '<div class="cols"><div><h2>Message the state officers</h2><p class="sub">Send a question or idea to a state officer or the Presidents Council. You can stay anonymous.</p>' + contactForm() + '</div><div><h2>Presidents Council</h2><p>' + esc(H.council) + '</p><p><a href="#connect-events">See council meetings</a></p></div></div></section><section id="events"><h2>Online events</h2><p class="sub">All events are virtual.</p><div class="filters">' + select("et", "All event types", uniq(H.events.map(function (e) { return e.type; }))) + "</div>" + eventRows(H.events.filter(function (e) { return !state.et || e.type === state.et; })) + "</section></div>";
    },
    saved: function () { var L = H.opps.filter(function (o) { return saved.indexOf(o.id) > -1; }); return head("My Saved", "Bookmarks are stored in this browser only.") + wrap('<ul class="list">' + (L.map(oppRow).join("") || '<li class="item">Nothing saved yet.</li>') + "</ul>"); },
    search: searchPage
  };
  function detail(id) {
    var o = H.opps.filter(function (x) { return x.id === id; })[0];
    if (!o) return wrap("<h2>Not found</h2><a href='#home'>Back home</a>");
    var back = o.cat === "internship" ? "internships" : "university";
    return '<div class="wrap"><section><a class="back" href="#' + back + '">Back to listings</a><h1>' + esc(o.title) + '</h1><p class="meta">' + esc(o.org) + "</p>" + sample + "<p>" + esc(o.desc) + "</p><dl><dt>Eligibility</dt><dd>" + esc(o.elig) + "</dd><dt>Grades</dt><dd>" + o.grades.join(", ") + "</dd><dt>Compensation</dt><dd>" + esc(o.comp) + "</dd><dt>Location</dt><dd>" + esc(o.loc) + " (" + esc(o.mode) + ")</dd><dt>Deadline</dt><dd>" + fmt(o.deadline) + " " + due(o.deadline) + "</dd><dt>Last verified</dt><dd>" + fmt(o.verified) + '</dd></dl><a class="btn" href="' + esc(o.url) + '" target="_blank" rel="noopener">Apply on external site</a> <button class="btn ghost" data-save="' + o.id + '">' + (saved.indexOf(o.id) > -1 ? "Saved" : "Save") + "</button></section></div>";
  }
  function render(keep) {
    var h = location.hash.slice(1) || "home", m = h.match(/^opp-(.+)$/), scroll = false;
    if (h === "connect-events") { h = "connect"; scroll = true; }
    app.innerHTML = m ? detail(m[1]) : (P[h] || P.home)();
    nav.querySelectorAll("a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + h); });
    nav.classList.remove("open"); document.getElementById("menu").setAttribute("aria-expanded", "false");
    if (scroll) { var ev = document.getElementById("events"); ev && ev.scrollIntoView(); } else if (!keep) { window.scrollTo(0, 0); }
    document.title = (h === "home" ? "" : (NAV.filter(function (n) { return n[0] === h; })[0] || [0, "Hub"])[1] + " | ") + "California DECA Student Hub";
  }
  nav.innerHTML = NAV.map(function (n) { return '<a href="#' + n[0] + '">' + n[1] + "</a>"; }).join("") + '<a class="gap" href="#search">Search</a><a href="#saved">My Saved</a>';
  document.getElementById("foot-links").innerHTML = H.contact.social.map(function (s) { return '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + "</a>"; }).join("") + '<a href="mailto:' + esc(H.contact.email) + '">' + esc(H.contact.email) + "</a>";
  document.getElementById("menu").onclick = function () { var o = nav.classList.toggle("open"); this.setAttribute("aria-expanded", o); };
  document.addEventListener("change", function (e) { var k = e.target.getAttribute && e.target.getAttribute("data-f"); if (k) { state[k] = e.target.value; render(true); } });
  document.addEventListener("input", function (e) {
    if (e.target.id === "cq" || e.target.id === "q") {
      var id = e.target.id, p = e.target.selectionStart; if (id === "cq") state.cq = e.target.value; else query = e.target.value;
      render(true); var n = document.getElementById(id); n.focus(); n.setSelectionRange(p, p);
    }
  });
  document.addEventListener("click", function (e) {
    var s = e.target.getAttribute && e.target.getAttribute("data-save"), d = e.target.getAttribute && e.target.getAttribute("data-dl");
    if (s) { var i = saved.indexOf(s); if (i > -1) saved.splice(i, 1); else saved.push(s); persist(); render(true); }
    if (d) { var r = RES.filter(function (x) { return x.id === d; })[0]; var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([r.t + "\n\nSample file. Replace with the real resource.\n"], {type: "text/plain"})); a.download = r.t.replace(/\W+/g, "-") + ".txt"; a.click(); }
  });
  document.addEventListener("submit", function (e) {
    e.preventDefault();
    if (e.target.id === "hf") { query = document.getElementById("hq").value; location.hash = "search"; return; }
    if (e.target.id === "sf") return;
    if (e.target.id === "cf") {
      var st = document.getElementById("cs"), f = e.target;
      if (f.website.value) return;
      if (!f.message.value.trim()) { st.textContent = "Please write a message first."; return; }
      if (!H.contact.formEndpoint) { st.textContent = "The contact form is not connected yet, so nothing was sent. An admin needs to add a form endpoint in data.js."; return; }
      fetch(H.contact.formEndpoint, {method: "POST", body: new FormData(f), headers: {Accept: "application/json"}})
        .then(function (r) { if (r.ok) { f.reset(); st.textContent = "Sent. Thank you."; } else { st.textContent = "Something went wrong. Please try again."; } })
        .catch(function () { st.textContent = "Could not send. Check your connection and try again."; });
    }
  });
  window.addEventListener("hashchange", function () { render(); });
  render();
})();
