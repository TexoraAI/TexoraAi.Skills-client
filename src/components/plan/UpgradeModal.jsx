import { useEffect, useState, useCallback } from "react";
import {
  BookOpen,
  Video,
  FileText,
  Radio,
  CalendarClock,
  Sparkles,
  ClipboardCheck,
  FileUser,
  Building2,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Crown,
  Gem,
} from "lucide-react";
import planEntitlementService from "../../services/planEntitlementService";
import {
  getComparisonMatrix,
  PLAN_TIER_LABELS,
} from "../../services/planFeatures";

// UpgradeModal.jsx
//
// <UpgradeModal
//   isOpen={open}
//   onClose={() => setOpen(false)}
//   planType="individual"            // "org" | "individual" | "resume"
//   userId={currentUser.id}          // always required
//   orgId={org.id}                   // required only when planType === "org"
//   currentPlan="free"
//   availableTargetPlans={["pro", "premium"]}   // org: ["starter","growth"] etc.
//   featureLabel="You've used all 3 AI resume generations this month"
//   onSuccess={(newPlan) => refetchUsage()}
//   role={currentUser.role}          // "TRAINER" | "STUDENT" | "ORG_ADMIN"
//                                     // — REQUIRED to filter features correctly,
//                                     // otherwise every role sees everything
// />
//
// ⚠️ ASSUMPTION TO VERIFY: the shape of the /api/payments/initiate response
// isn't specified in the backend doc. This assumes it returns
// { orderId, razorpayOrderId, razorpayKeyId, amount, currency }.
// Check your actual payment-wallet-service response and adjust the
// destructuring in handleUpgrade() below if field names differ.
//
// Feature comparison uses getComparisonMatrix() from services/planFeatures.js —
// shows all three tiers side by side (current plan highlighted, target plan
// highlighted) so a free user can see everything at once, not just a single
// current→target arrow. Requires lucide-react (already imported above).

const CATEGORY_ICONS = {
  BookOpen,
  Video,
  FileText,
  Radio,
  CalendarClock,
  Sparkles,
  ClipboardCheck,
  FileUser,
  Building2,
};

const DURATIONS = [
  { months: 1, label: "1 month", badge: null },
  { months: 6, label: "6 months", badge: "Save 15%" },
  { months: 12, label: "12 months", badge: "Save 30%" },
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Fixed grid template — labels get a wider, flexible column; each tier
// gets an equal-width column. Keeping this identical everywhere (header
// row + every item row) is what keeps the table's columns aligned instead
// of collapsing into the tall/uneven "rectangle" rows.
const GRID_TEMPLATE = "minmax(120px,1.5fr) repeat(3, minmax(56px,1fr))";

function TierCell({ type, value, isCurrent, isTarget, improved }) {
  const base = "flex items-center justify-center text-center px-1 py-2";
  const tone = isTarget
    ? improved
      ? "text-emerald-600 dark:text-emerald-400 font-bold"
      : "text-violet-600 dark:text-violet-400 font-bold"
    : isCurrent
      ? "text-gray-500 dark:text-slate-400 font-medium"
      : "text-gray-400 dark:text-slate-500";

  if (type === "boolean") {
    const included = value === "Included";
    return (
      <div className={`${base} ${tone}`}>
        {included ? (
          <CheckCircle2 size={15} className={isTarget ? "" : "opacity-70"} />
        ) : (
          <XCircle size={15} className="text-gray-300 dark:text-slate-600" />
        )}
      </div>
    );
  }
  return (
    <div className={`${base} ${tone} text-xs sm:text-[13px] leading-tight`}>
      {value}
    </div>
  );
}

function FeatureCategoryCard({
  category,
  icon,
  items,
  tiers,
  currentTier,
  targetTier,
  defaultOpen,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = CATEGORY_ICONS[icon] || Sparkles;
  const improvedCount = items.filter((i) => i.improved).length;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
          <Icon
            size={16}
            className="text-violet-600 dark:text-violet-400 shrink-0"
          />
          {category}
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {improvedCount > 0 && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-500 hidden xs:inline">
              {improvedCount} upgraded
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="overflow-x-auto">
          <div className="min-w-[280px]">
            {/* Tier header row — same grid template as every item row below */}
            <div
              className="grid items-center border-b border-gray-100 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.02] px-3 py-1.5"
              style={{ gridTemplateColumns: GRID_TEMPLATE }}
            >
              <span />
              {tiers.map((t) => (
                <div
                  key={t}
                  className={`text-center text-[10px] font-bold uppercase tracking-wide ${
                    t === targetTier
                      ? "text-violet-600 dark:text-violet-400"
                      : t === currentTier
                        ? "text-gray-500 dark:text-slate-400"
                        : "text-gray-400 dark:text-slate-500"
                  }`}
                >
                  {PLAN_TIER_LABELS[t] || t}
                  {t === currentTier && (
                    <div className="text-[9px] font-medium normal-case text-gray-400 dark:text-slate-500">
                      current
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="divide-y divide-gray-100 dark:divide-white/10">
              {items.map((item) => (
                <div
                  key={item.label}
                  className="grid items-center px-3"
                  style={{ gridTemplateColumns: GRID_TEMPLATE }}
                >
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 py-2 pr-1">
                    {item.label}
                  </span>
                  {tiers.map((t) => (
                    <TierCell
                      key={t}
                      type={item.type}
                      value={item.values[t]}
                      isCurrent={t === currentTier}
                      isTarget={t === targetTier}
                      improved={item.improved}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureComparison({ planType, currentPlan, selectedPlan, role }) {
  const matrix = getComparisonMatrix(planType, currentPlan, selectedPlan, role);
  const totalUpgraded = matrix.categories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.improved).length,
    0,
  );

  if (matrix.categories.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
          Plan Comparison
        </span>
        {totalUpgraded > 0 && (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500">
            {totalUpgraded} features improve with {selectedPlan}
          </span>
        )}
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {matrix.categories.map((cat, idx) => (
          <FeatureCategoryCard
            key={cat.category}
            category={cat.category}
            icon={cat.icon}
            items={cat.items}
            tiers={matrix.tiers}
            currentTier={matrix.currentTier}
            targetTier={matrix.targetTier}
            defaultOpen={idx === 0}
          />
        ))}
      </div>
    </div>
  );
}

const PLAN_ICONS = {
  pro: Crown,
  premium: Gem,
  starter: Crown,
  growth: Gem,
  free: Sparkles,
  trial: Sparkles,
};

// Pulls a handful of real feature values for a given target plan (used as
// the short bullet list on each pricing card) — pulled straight from the
// same data the full comparison table below uses, so the bullets are never
// fabricated copy, just the first few real rows formatted as "Label: value".
function planHighlights(planType, currentPlan, targetPlan, role, limit = 6) {
  const matrix = getComparisonMatrix(planType, currentPlan, targetPlan, role);
  const bullets = [];
  for (const cat of matrix.categories) {
    for (const item of cat.items) {
      const value =
        item.type === "boolean"
          ? item.values[targetPlan] === "Included"
            ? item.label
            : null
          : `${item.label}: ${item.values[targetPlan]}`;
      if (value) bullets.push(value);
      if (bullets.length >= limit) return bullets;
    }
  }
  return bullets;
}

function PlanCard({
  planKey,
  selected,
  popular,
  price,
  priceLoading,
  durationMonths,
  highlights,
  onSelect,
}) {
  const Icon = PLAN_ICONS[planKey] || Sparkles;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex-1 text-left rounded-2xl border-2 p-4 sm:p-5 transition-all ${
        selected
          ? "border-violet-600 bg-violet-50/70 dark:bg-violet-500/10 shadow-md"
          : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-violet-300 dark:hover:border-violet-500/40"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold text-white shadow whitespace-nowrap">
          Most Popular
        </span>
      )}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
          selected
            ? "bg-violet-600 text-white"
            : "bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400"
        }`}
      >
        <Icon size={18} />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white capitalize">
        {PLAN_TIER_LABELS[planKey] || planKey}
      </h3>
      <div className="mt-1 mb-3 min-h-[26px]">
        {priceLoading ? (
          <span className="text-xs text-gray-400 dark:text-slate-500">
            Calculating…
          </span>
        ) : price != null ? (
          <span className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              ₹{price}
            </span>
            <span className="text-xs font-medium text-gray-400 dark:text-slate-500">
              / {durationMonths} mo{durationMonths > 1 ? "s" : ""}
            </span>
          </span>
        ) : (
          <span className="text-xs text-gray-400 dark:text-slate-500">
            Select to see price
          </span>
        )}
      </div>
      <ul className="space-y-1.5">
        {highlights.map((h) => (
          <li
            key={h}
            className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-slate-300"
          >
            <CheckCircle2
              size={13}
              className="mt-0.5 text-emerald-500 shrink-0"
            />
            <span className="leading-snug">{h}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

export default function UpgradeModal({
  isOpen,
  onClose,
  planType, // "org" | "individual" | "resume"
  userId,
  orgId = null,
  currentPlan,
  availableTargetPlans,
  featureLabel,
  onSuccess,
  role, // "TRAINER" | "STUDENT" | "ORG_ADMIN" — controls which features show
}) {
  const [selectedPlan, setSelectedPlan] = useState(availableTargetPlans?.[0]);
  const [durationMonths, setDurationMonths] = useState(1);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchPreview = useCallback(async () => {
    if (!selectedPlan) return;
    setPreviewLoading(true);
    setError(null);
    try {
      let data;
      if (planType === "org") {
        data = await planEntitlementService.getOrgUpgradePreview(
          orgId,
          selectedPlan,
          durationMonths,
        );
      } else if (planType === "resume") {
        data = await planEntitlementService.getResumePlanUpgradePreview(
          userId,
          selectedPlan,
          durationMonths,
        );
      } else {
        data = await planEntitlementService.getIndividualUpgradePreview(
          userId,
          selectedPlan,
          durationMonths,
        );
      }
      setPreview(data);
    } catch (err) {
      setError("Couldn't load pricing. Try again.");
      setPreview(null);
    } finally {
      setPreviewLoading(false);
    }
  }, [planType, orgId, userId, selectedPlan, durationMonths]);

  useEffect(() => {
    if (isOpen) fetchPreview();
  }, [isOpen, fetchPreview]);

  if (!isOpen) return null;

  async function handleUpgrade() {
    if (!preview?.valid) return;
    setPaying(true);
    setError(null);
    setStatusMessage("Preparing checkout...");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Couldn't load payment gateway. Check your connection.");
        setPaying(false);
        return;
      }

      const purpose =
        planType === "resume" ? "RESUME_PLAN_UPGRADE" : "PLAN_UPGRADE";
      const referenceId = `${selectedPlan}:${durationMonths}`;
      const idempotencyKey =
        crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

      const initiateRes = await planEntitlementService.initiatePayment(
        {
          userId,
          orgId: planType === "org" ? orgId : null,
          purpose,
          referenceId,
          amount: preview.price,
        },
        idempotencyKey,
      );

      // ⚠️ verify these field names against your real response — see note at top
      const { orderId, razorpayKeyId, amount, currency } = initiateRes;

      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        amount,
        currency: currency || "INR",
        order_id: orderId,
        name: "Plan Upgrade",
        description: `Upgrade to ${selectedPlan} (${durationMonths}mo)`,
        handler: () => pollPaymentStatus(orderId),
        modal: {
          ondismiss: () => {
            setPaying(false);
            setStatusMessage(null);
          },
        },
      });

      rzp.open();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Couldn't start payment. Try again.",
      );
      setPaying(false);
      setStatusMessage(null);
    }
  }

  async function pollPaymentStatus(orderId) {
    setStatusMessage("Activating your plan...");
    const maxAttempts = 15; // ~30s at 2s interval — adjust to your webhook latency
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const status = await planEntitlementService.getPaymentStatus(orderId);
        if (status.status === "CAPTURED") {
          setStatusMessage("Plan activated!");
          setPaying(false);
          onSuccess?.(selectedPlan);
          setTimeout(onClose, 1200);
          return;
        }
        if (status.status === "FAILED") {
          setError("Payment failed. Please try again.");
          setPaying(false);
          setStatusMessage(null);
          return;
        }
      } catch {
        // keep polling — a transient error here shouldn't kill the flow
      }
    }
    setError(
      "Payment is taking longer than expected to confirm. Check back in a moment.",
    );
    setPaying(false);
    setStatusMessage(null);
  }

  return (
    <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="w-full max-w-3xl rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#14141f] p-5 sm:p-7 text-gray-900 dark:text-white shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Upgrade Your Plan
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {featureLabel ||
                "Choose the right plan and unlock more of what you need."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 pt-3">
          <label className="mb-2.5 block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
            Target plan
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {availableTargetPlans.map((plan, idx) => (
              <PlanCard
                key={plan}
                planKey={plan}
                selected={selectedPlan === plan}
                popular={idx === 0}
                price={
                  plan === selectedPlan && preview?.valid
                    ? (preview.price / 100).toFixed(0)
                    : null
                }
                priceLoading={plan === selectedPlan && previewLoading}
                durationMonths={durationMonths}
                highlights={planHighlights(planType, currentPlan, plan, role)}
                onSelect={() => setSelectedPlan(plan)}
              />
            ))}
          </div>
        </div>

        {/* Categorized feature comparison — replaces the old flat table */}
        {selectedPlan && (
          <FeatureComparison
            planType={planType}
            currentPlan={currentPlan}
            selectedPlan={selectedPlan}
            role={role}
          />
        )}

        <div className="mb-6">
          <label className="mb-2.5 block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
            Billing Duration
          </label>
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-gray-100 dark:bg-white/5 p-1.5">
            {DURATIONS.map((d) => (
              <button
                key={d.months}
                onClick={() => setDurationMonths(d.months)}
                className={`relative rounded-xl py-2 text-xs sm:text-sm font-semibold transition-colors ${
                  durationMonths === d.months
                    ? "bg-violet-600 text-white shadow"
                    : "text-gray-600 dark:text-white/70 hover:bg-white dark:hover:bg-white/10"
                }`}
              >
                {d.label}
                {d.badge && (
                  <span className="absolute -top-2 -right-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
                    {d.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            Selected Plan Summary
          </h4>
          {previewLoading && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Calculating price...
            </p>
          )}
          {!previewLoading && preview && preview.valid && (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-slate-400">Plan</dt>
                <dd className="font-semibold text-gray-900 dark:text-white capitalize">
                  {currentPlan} → {selectedPlan}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-slate-400">Duration</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">
                  {durationMonths} month{durationMonths > 1 ? "s" : ""}
                </dd>
              </div>
              <div className="flex justify-between items-baseline border-t border-gray-200 dark:border-white/10 pt-2 mt-1">
                <dt className="text-gray-500 dark:text-slate-400">Price</dt>
                {/* preview.price is in paise (see IndividualPlanLimits.java,
                    e.g. PRO_STUDENT_PRICE = 19900 = ₹199.00) — divide by
                    100 for display only. The raw paise value (preview.price)
                    is still what gets sent to initiatePayment below, since
                    Razorpay's amount field also expects paise. */}
                <dd className="text-lg font-extrabold text-gray-900 dark:text-white">
                  ₹{(preview.price / 100).toFixed(2)}
                </dd>
              </div>
              {preview.expiresAt && (
                <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500">
                  <dt>Valid until</dt>
                  <dd>{preview.expiresAt}</dd>
                </div>
              )}
            </dl>
          )}
          {!previewLoading && preview && !preview.valid && (
            <p className="text-red-500 text-sm">
              {preview.reason || "This upgrade isn't available."}
            </p>
          )}
        </div>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        {statusMessage && (
          <p className="mb-3 text-sm text-gray-500 dark:text-slate-400">
            {statusMessage}
          </p>
        )}

        <button
          onClick={handleUpgrade}
          disabled={!preview?.valid || paying || previewLoading}
          className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-3 text-sm sm:text-base font-bold text-white shadow-lg shadow-violet-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paying ? "Processing..." : "Upgrade Now"}
        </button>
      </div>
    </div>
  );
}
