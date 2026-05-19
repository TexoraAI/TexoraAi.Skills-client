import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

// ─── Toggle ───────────────────────────────────────────────────
const Toggle = ({ value, onChange, label, desc, danger, dark }) => (
  <div className={`flex items-start justify-between gap-4 py-4 border-b last:border-0 ${dark ? "border-white/5" : "border-gray-100"}`}>
    <div className="flex-1">
      <p className={`text-sm font-medium ${danger ? "text-red-500" : dark ? "text-white" : "text-gray-800"}`}>{label}</p>
      {desc && <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-400"}`}>{desc}</p>}
    </div>
    <button onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-all duration-200 ${value ? (danger ? "bg-red-500" : "bg-violet-500") : dark ? "bg-white/10" : "bg-gray-200"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-5" : ""}`} />
    </button>
  </div>
);

const Field = ({ label, desc, children, dark }) => (
  <div className={`py-4 border-b last:border-0 ${dark ? "border-white/5" : "border-gray-100"}`}>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex-1 min-w-48">
        <p className={`text-sm font-medium ${dark ? "text-white" : "text-gray-800"}`}>{label}</p>
        {desc && <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-400"}`}>{desc}</p>}
      </div>
      <div className="shrink-0 min-w-48">{children}</div>
    </div>
  </div>
);

const Input = ({ value, onChange, type = "text", placeholder, dark }) => (
  <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
      dark
        ? "bg-white/5 border-white/10 text-white placeholder-slate-500"
        : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
    }`}
  />
);

const Section = ({ icon, title, badge, children, dark }) => (
  <div className={`rounded-xl border overflow-hidden ${dark ? "bg-white/[0.03] border-white/8" : "bg-white border-gray-200"}`}>
    <div className={`flex items-center gap-3 px-5 py-4 border-b ${dark ? "border-white/8 bg-white/[0.02]" : "border-gray-100 bg-gray-50"}`}>
      <span className="text-xl">{icon}</span>
      <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-800"}`}>{title}</h3>
      {badge && <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>}
    </div>
    <div className="px-5">{children}</div>
  </div>
);

const MOCK_LOGS = [
  { ip:"103.21.244.12", user:"admin@texora.ai",       time:"2m ago",  result:"success", country:"IN" },
  { ip:"185.176.26.8",  user:"trainer5@example.com",  time:"12m ago", result:"failed",  country:"RU" },
  { ip:"45.153.160.0",  user:"unknown@xyz.com",        time:"18m ago", result:"blocked", country:"CN" },
  { ip:"106.51.68.14",  user:"student22@example.com", time:"1h ago",  result:"success", country:"IN" },
  { ip:"104.21.3.1",    user:"hacker@spam.io",         time:"2h ago",  result:"blocked", country:"US" },
];

const resultStyle = {
  success: "bg-emerald-500/10 text-emerald-500",
  failed:  "bg-amber-500/10 text-amber-500",
  blocked: "bg-red-500/10 text-red-500",
};

const SecuritySettings = () => {
  const { dark } = useTheme();
  const [saved, setSaved] = useState(false);

  const [auth, setAuth] = useState({
    twoFactor:true, forceTFAAdmins:true, ssoEnabled:false, googleAuth:false,
    passwordMinLength:"10", passwordExpireDays:"90", maxLoginAttempts:"5",
    lockoutDuration:"30", sessionTimeout:"60",
  });
  const [ip, setIp] = useState({
    whitelist:false, whitelistIPs:"", blacklist:true,
    blacklistIPs:"185.176.26.8\n45.153.160.0", geoBlocking:false, blockedCountries:"CN, KP, RU",
  });
  const [audit, setAudit] = useState({
    logLogins:true, logDataExports:true, logPermissionChanges:true,
    logUserDeletions:true, retentionDays:"90", alertOnSuspicious:true,
  });
  const [encryption, setEncryption] = useState({
    forceHttps:true, hsts:true, contentSecurityPolicy:true,
    xssProtection:true, rateLimiting:true, corsStrict:false,
  });

  const setA  = (k) => (v) => setAuth((p) => ({ ...p, [k]:v }));
  const setI  = (k) => (v) => setIp((p)   => ({ ...p, [k]:v }));
  const setAu = (k) => (v) => setAudit((p) => ({ ...p, [k]:v }));
  const setE  = (k) => (v) => setEncryption((p) => ({ ...p, [k]:v }));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const titleText = dark ? "text-white"    : "text-gray-800";
  const subText   = dark ? "text-slate-400": "text-gray-500";
  const scoreBg   = dark
    ? "bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border-violet-500/20"
    : "bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200";
  const tableHdr  = dark ? "border-white/6"  : "border-gray-200";
  const tableRow  = dark ? "divide-white/4 hover:bg-white/[0.02]" : "divide-gray-100 hover:bg-gray-50";
  const dangerZone= dark ? "border-red-500/20 bg-red-500/5"        : "border-red-200 bg-red-50";
  const dangerCard= dark ? "border-red-500/10 bg-red-500/5"        : "border-red-200 bg-red-100/50";

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-bold ${titleText}`}>Security Settings</h2>
          <p className={`text-sm mt-0.5 ${subText}`}>Harden your platform against unauthorized access</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-all">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Save Security Config
        </button>
      </div>

      {/* Security Score */}
      <div className={`rounded-xl border p-5 ${scoreBg}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className={`text-sm font-medium ${subText}`}>Security Score</p>
            <p className={`text-4xl font-black mt-1 ${titleText}`}>84 <span className={`text-lg font-normal ${subText}`}>/ 100</span></p>
            <p className="text-sm text-emerald-500 font-medium mt-1">🟢 Good — 2 recommendations pending</p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label:"Two-Factor Auth",  done:auth.twoFactor          },
              { label:"HTTPS Enforced",   done:encryption.forceHttps   },
              { label:"Audit Logging",    done:audit.logLogins         },
              { label:"SSO Enabled",      done:auth.ssoEnabled         },
              { label:"Geo Blocking",     done:ip.geoBlocking          },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={done ? "text-emerald-500" : dark ? "text-slate-500" : "text-gray-400"}>{done ? "✓" : "○"}</span>
                <span className={done ? dark ? "text-slate-300" : "text-gray-700" : dark ? "text-slate-500" : "text-gray-400"}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Authentication */}
      <Section dark={dark} icon="🔐" title="Authentication & Passwords" badge={{ label:"Critical", color:"bg-red-500/10 text-red-500" }}>
        <Toggle dark={dark} value={auth.twoFactor}      onChange={setA("twoFactor")}      label="Two-Factor Authentication (2FA)" desc="Users must verify via TOTP app on login" />
        <Toggle dark={dark} value={auth.forceTFAAdmins} onChange={setA("forceTFAAdmins")} label="Force 2FA for Admins"              desc="Admins cannot access dashboard without 2FA" />
        <Toggle dark={dark} value={auth.ssoEnabled}     onChange={setA("ssoEnabled")}     label="Single Sign-On (SSO)"             desc="Allow login via your organization's identity provider" />
        <Toggle dark={dark} value={auth.googleAuth}     onChange={setA("googleAuth")}     label="Google OAuth"                     desc="Allow login with Google accounts" />
        <Field  dark={dark} label="Minimum Password Length" desc="Minimum characters required">
          <Input dark={dark} value={auth.passwordMinLength}  onChange={setA("passwordMinLength")}  type="number" />
        </Field>
        <Field  dark={dark} label="Password Expiry (days)" desc="Force reset after this many days (0 = never)">
          <Input dark={dark} value={auth.passwordExpireDays} onChange={setA("passwordExpireDays")} type="number" />
        </Field>
        <Field  dark={dark} label="Max Login Attempts" desc="Lock account after consecutive failures">
          <Input dark={dark} value={auth.maxLoginAttempts}   onChange={setA("maxLoginAttempts")}   type="number" />
        </Field>
        <Field  dark={dark} label="Lockout Duration (minutes)" desc="How long a locked account stays locked">
          <Input dark={dark} value={auth.lockoutDuration}    onChange={setA("lockoutDuration")}    type="number" />
        </Field>
        <Field  dark={dark} label="Session Timeout (minutes)" desc="Auto-logout idle users">
          <Input dark={dark} value={auth.sessionTimeout}     onChange={setA("sessionTimeout")}     type="number" />
        </Field>
      </Section>

      {/* IP Management */}
      <Section dark={dark} icon="🌐" title="IP Access Control">
        <Toggle dark={dark} value={ip.whitelist}   onChange={setI("whitelist")}   label="IP Whitelist (Admin Only)" desc="Only allow admin access from specific IPs" />
        {ip.whitelist && (
          <Field dark={dark} label="Whitelisted IPs" desc="One IP per line">
            <textarea value={ip.whitelistIPs} onChange={(e) => setIp((p) => ({ ...p, whitelistIPs:e.target.value }))}
              rows={3} placeholder={"192.168.1.1\n10.0.0.1"}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-violet-500/50 font-mono resize-none ${
                dark ? "bg-white/5 border-white/10 text-white placeholder-slate-500" : "bg-white border-gray-200 text-gray-800"
              }`}
            />
          </Field>
        )}
        <Toggle dark={dark} value={ip.blacklist}   onChange={setI("blacklist")}   label="IP Blacklist"        desc="Block specific IP addresses" />
        {ip.blacklist && (
          <Field dark={dark} label="Blacklisted IPs" desc="One IP per line">
            <textarea value={ip.blacklistIPs} onChange={(e) => setIp((p) => ({ ...p, blacklistIPs:e.target.value }))}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-violet-500/50 font-mono resize-none ${
                dark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-200 text-gray-800"
              }`}
            />
          </Field>
        )}
        <Toggle dark={dark} value={ip.geoBlocking} onChange={setI("geoBlocking")} label="Geographic Blocking" desc="Block access from specific countries" />
        {ip.geoBlocking && (
          <Field dark={dark} label="Blocked Countries" desc="Comma-separated ISO codes (e.g. CN, KP)">
            <Input dark={dark} value={ip.blockedCountries} onChange={setI("blockedCountries")} placeholder="CN, KP, RU" />
          </Field>
        )}
      </Section>

      {/* HTTP Headers */}
      <Section dark={dark} icon="🛡️" title="HTTP Security Headers">
        <Toggle dark={dark} value={encryption.forceHttps}             onChange={setE("forceHttps")}             label="Force HTTPS"                      desc="Redirect all HTTP traffic to HTTPS" />
        <Toggle dark={dark} value={encryption.hsts}                   onChange={setE("hsts")}                   label="HSTS (Strict-Transport-Security)"  desc="Enforce HTTPS even for cached responses" />
        <Toggle dark={dark} value={encryption.contentSecurityPolicy}  onChange={setE("contentSecurityPolicy")}  label="Content Security Policy"          desc="Prevent XSS and code injection attacks" />
        <Toggle dark={dark} value={encryption.xssProtection}          onChange={setE("xssProtection")}          label="XSS Protection Header"            desc="Browser-level cross-site scripting protection" />
        <Toggle dark={dark} value={encryption.rateLimiting}           onChange={setE("rateLimiting")}           label="API Rate Limiting"                desc="Limit requests per IP (100 req/min)" />
        <Toggle dark={dark} value={encryption.corsStrict}             onChange={setE("corsStrict")}             label="Strict CORS Policy"               desc="Only allow requests from whitelisted origins" />
      </Section>

      {/* Audit Logging */}
      <Section dark={dark} icon="📋" title="Audit & Logging">
        <Toggle dark={dark} value={audit.logLogins}            onChange={setAu("logLogins")}            label="Log All Login Attempts"      desc="Store success, failure, and blocked login events" />
        <Toggle dark={dark} value={audit.logDataExports}       onChange={setAu("logDataExports")}       label="Log Data Exports"            desc="Track every CSV or report export" />
        <Toggle dark={dark} value={audit.logPermissionChanges} onChange={setAu("logPermissionChanges")} label="Log Permission Changes"      desc="Record every RBAC permission modification" />
        <Toggle dark={dark} value={audit.logUserDeletions}     onChange={setAu("logUserDeletions")}     label="Log User Deletions"          desc="Permanent record before any user is deleted" />
        <Toggle dark={dark} value={audit.alertOnSuspicious}    onChange={setAu("alertOnSuspicious")}    label="Alert on Suspicious Activity" desc="Email SuperAdmin on repeated failed logins" danger />
        <Field  dark={dark} label="Log Retention Period (days)" desc="Auto-delete logs older than this">
          <Input dark={dark} value={audit.retentionDays} onChange={setAu("retentionDays")} type="number" />
        </Field>
      </Section>

      {/* Login Activity */}
      <Section dark={dark} icon="🕵️" title="Recent Login Activity">
        <div className="py-2 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${tableHdr}`}>
                {["IP Address","User","Country","Time","Result"].map((h) => (
                  <th key={h} className={`py-2 px-2 text-left text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-400" : "text-gray-500"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${tableRow}`}>
              {MOCK_LOGS.map((log, i) => (
                <tr key={i} className="transition-colors">
                  <td className={`py-2.5 px-2 text-xs font-mono ${dark ? "text-slate-300" : "text-gray-700"}`}>{log.ip}</td>
                  <td className={`py-2.5 px-2 text-xs truncate max-w-32 ${dark ? "text-slate-300" : "text-gray-700"}`}>{log.user}</td>
                  <td className={`py-2.5 px-2 text-xs ${dark ? "text-slate-400" : "text-gray-500"}`}>{log.country}</td>
                  <td className={`py-2.5 px-2 text-xs ${dark ? "text-slate-500" : "text-gray-400"}`}>{log.time}</td>
                  <td className="py-2.5 px-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${resultStyle[log.result]}`}>{log.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-3 text-xs text-violet-500 hover:text-violet-400 transition-colors">View full audit log →</button>
        </div>
      </Section>

      {/* Danger Zone */}
      <div className={`rounded-xl border p-5 ${dangerZone}`}>
        <h3 className="text-sm font-semibold text-red-500 mb-4">⚠️ Danger Zone</h3>
        <div className="space-y-3">
          {[
            { label:"Force Logout All Users", desc:"Immediately invalidate all active sessions",    btn:"Force Logout"  },
            { label:"Clear All Sessions",     desc:"Wipe every stored session from the database",   btn:"Clear Sessions" },
            { label:"Reset All 2FA",          desc:"Force every user to re-enroll 2FA on next login", btn:"Reset 2FA"   },
          ].map(({ label, desc, btn }) => (
            <div key={label} className={`flex items-center justify-between gap-4 p-3 rounded-lg border ${dangerCard}`}>
              <div>
                <p className="text-sm font-medium text-red-500">{label}</p>
                <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-400"}`}>{desc}</p>
              </div>
              <button className="shrink-0 px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-400/40 hover:bg-red-500/15 rounded-lg transition-all">
                {btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6L9 17l-5-5"/></svg>
          Security settings saved!
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;