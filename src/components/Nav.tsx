const links=[['/','Command Center'],['/jobs','Jobs'],['/scoring','Scoring'],['/resume','Resume'],['/applications','Applications'],['/followup','Follow-up']];
export function Nav(){return <aside className="sidebar"><div className="brand">Career<span>OS</span></div><nav className="nav">{links.map(([href,label])=><a key={href} href={href}>{label}</a>)}</nav></aside>}
