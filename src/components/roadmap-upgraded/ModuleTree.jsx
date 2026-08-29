// import { useState } from "react";
// import { RESOURCE_ICON } from "./constants";
// import QuizModal from "./QuizModal";
// import VideoModal from "./VideoModal";
// import ArticleModal from "./ArticleModal";
// import PdfModal from "./PdfModal";

// /**
//  * Renders modules[] from a RoadmapUpgradedResponseDto. Each module now
//  * contains topics[], and each topic (not the module) carries the actual
//  * resources[]:
//  *   { id, orderIndex, title, locked, progressPercent, topics: [
//  *     { id, orderIndex, title, progressPercent, resources: [
//  *       { id, type, title, sourceUrl, filePath, durationOrLength, completed,
//  *         quizScore, quizContentJson, contentBody, hasPdf }
//  *     ]}
//  *   ]}
//  *
//  * Everything about how an individual resource renders/opens/completes is
//  * unchanged from before this topic layer existed - see renderResourceRow()
//  * below, which is the exact same logic that used to live inline in the
//  * module body, just extracted so it can run once per topic instead of once
//  * per module.
//  *
//  * Props:
//  *   modules            - RoadmapUpgradedModuleDto[] (now with topics[])
//  *   onCompleteResource - (resourceId, quizScoreOrNull) => Promise
//  *   onLockedClick      - (moduleTitle) => void   (e.g. show a toast)
//  */
// export default function ModuleTree({
//   modules,
//   onCompleteResource,
//   onLockedClick,
// }) {
//   const [openIndex, setOpenIndex] = useState(() => {
//     const firstUnlocked = (modules || []).findIndex((m) => !m.locked);
//     return firstUnlocked === -1 ? 0 : firstUnlocked;
//   });
//   const [openTopics, setOpenTopics] = useState(() => new Set()); // keys: `${moduleIndex}-${topicIndex}`
//   const [pendingId, setPendingId] = useState(null);
//   const [activeQuiz, setActiveQuiz] = useState(null);
//   const [activeVideo, setActiveVideo] = useState(null);
//   const [activeArticle, setActiveArticle] = useState(null);
//   const [activePdf, setActivePdf] = useState(null);

//   if (!modules || modules.length === 0) {
//     return <div className="ru-empty-state">No modules yet.</div>;
//   }

//   async function complete(resourceId, quizScore = null) {
//     setPendingId(resourceId);
//     try {
//       await onCompleteResource(resourceId, quizScore);
//     } finally {
//       setPendingId(null);
//     }
//   }

//   function toggleTopic(key) {
//     setOpenTopics((prev) => {
//       const next = new Set(prev);
//       next.has(key) ? next.delete(key) : next.add(key);
//       return next;
//     });
//   }

//   function renderResourceRow(r) {
//     const isDone = !!r.completed;
//     const isQuiz = r.type === "QUIZ";
//     const isVideo = r.type === "VIDEO";
//     const isPlayableVideo = isVideo && !!r.sourceUrl;
//     const isArticle = r.type === "ARTICLE";
//     const isReadableArticle = isArticle && !!r.contentBody;
//     const isPdf = r.type === "PDF";
//     const isReadablePdf = isPdf && !!r.hasPdf;
//     const isPending = pendingId === r.id;

//     return (
//       <div key={r.id} className={`ru-res-row${isDone ? " done" : ""}`}>
//         <span className="ru-res-icon">{RESOURCE_ICON[r.type] || "•"}</span>
//         <span className="ru-res-type">{r.type?.toLowerCase()}</span>
//         <span style={{ flex: 1 }}>
//           {isQuiz && !isDone ? (
//             r.title
//           ) : isPlayableVideo ? (
//             <a
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setActiveVideo(r);
//               }}
//             >
//               {r.title}
//             </a>
//           ) : isReadableArticle ? (
//             <a
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setActiveArticle(r);
//               }}
//             >
//               {r.title}
//             </a>
//           ) : isReadablePdf ? (
//             <a
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setActivePdf(r);
//               }}
//             >
//               {r.title}
//             </a>
//           ) : !isVideo && !isArticle && !isPdf && r.sourceUrl ? (
//             <a href={r.sourceUrl} target="_blank" rel="noreferrer">
//               {r.title}
//             </a>
//           ) : (
//             r.title
//           )}
//           {r.durationOrLength && (
//             <span
//               style={{
//                 color: "var(--ru-muted)",
//                 marginLeft: 8,
//                 fontSize: ".78rem",
//               }}
//             >
//               {r.durationOrLength}
//             </span>
//           )}
//           {isQuiz && isDone && r.quizScore != null && (
//             <span
//               style={{
//                 color: "var(--ru-accent)",
//                 marginLeft: 8,
//                 fontSize: ".78rem",
//                 fontWeight: 700,
//               }}
//             >
//               Score: {r.quizScore}%
//             </span>
//           )}
//         </span>

//         {isDone ? (
//           <span className="ru-res-check">✓ DONE</span>
//         ) : isQuiz ? (
//           <button
//             className="ru-tool-btn"
//             disabled={isPending || !r.quizContentJson}
//             onClick={(e) => {
//               e.stopPropagation();
//               setActiveQuiz(r);
//             }}
//             title={
//               !r.quizContentJson
//                 ? "Quiz content unavailable for this resource"
//                 : undefined
//             }
//           >
//             {isPending ? "Saving…" : "Take Quiz"}
//           </button>
//         ) : isPlayableVideo ? (
//           <button
//             className="ru-tool-btn"
//             disabled={isPending}
//             onClick={(e) => {
//               e.stopPropagation();
//               setActiveVideo(r);
//             }}
//           >
//             {isPending ? "Saving…" : "Watch"}
//           </button>
//         ) : isReadableArticle ? (
//           <button
//             className="ru-tool-btn"
//             disabled={isPending}
//             onClick={(e) => {
//               e.stopPropagation();
//               setActiveArticle(r);
//             }}
//           >
//             {isPending ? "Saving…" : "Read"}
//           </button>
//         ) : isReadablePdf ? (
//           <button
//             className="ru-tool-btn"
//             disabled={isPending}
//             onClick={(e) => {
//               e.stopPropagation();
//               setActivePdf(r);
//             }}
//           >
//             {isPending ? "Saving…" : "View"}
//           </button>
//         ) : (
//           <button
//             className="ru-res-check"
//             style={{ background: "none", border: "none", cursor: "pointer" }}
//             disabled={isPending}
//             onClick={(e) => {
//               e.stopPropagation();
//               complete(r.id);
//             }}
//           >
//             {isPending ? "Saving…" : "Mark done"}
//           </button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div>
//       {modules.map((m, i) => {
//         const isOpen = openIndex === i;
//         const isLocked = !!m.locked;
//         const progress = m.progressPercent ?? 0;
//         const topics = m.topics || [];

//         return (
//           <div key={m.id ?? i} className={`ru-module${isOpen ? " open" : ""}`}>
//             <div
//               className="ru-module-head"
//               onClick={() =>
//                 isLocked
//                   ? onLockedClick?.(m.title)
//                   : setOpenIndex(isOpen ? -1 : i)
//               }
//             >
//               <div className="ru-mh-left">
//                 <div className={`ru-m-num${isLocked ? " locked" : ""}`}>
//                   {isLocked
//                     ? "🔒"
//                     : progress >= 100
//                       ? "✓"
//                       : (m.orderIndex ?? i) + 1}
//                 </div>
//                 <div>
//                   <div className="ru-mh-title">{m.title}</div>
//                   <div className="ru-mh-sub">
//                     {isLocked
//                       ? `Unlocks after Module ${m.orderIndex ?? i}`
//                       : `${topics.length} topic${topics.length === 1 ? "" : "s"}`}
//                   </div>
//                 </div>
//               </div>
//               <div className="ru-progress-bar">
//                 <div
//                   className="ru-progress-fill"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//             </div>

//             {isOpen && !isLocked && (
//               <div className="ru-module-body">
//                 {topics.map((t, ti) => {
//                   const topicKey = `${i}-${ti}`;
//                   const topicOpen = openTopics.has(topicKey);
//                   const topicProgress = t.progressPercent ?? 0;
//                   const resources = t.resources || [];

//                   return (
//                     <div
//                       key={t.id ?? ti}
//                       className={`ru-topic${topicOpen ? " open" : ""}`}
//                     >
//                       <div
//                         className="ru-topic-head"
//                         onClick={() => toggleTopic(topicKey)}
//                       >
//                         <div className="ru-topic-left">
//                           <span className="ru-topic-caret">
//                             {topicOpen ? "▾" : "▸"}
//                           </span>
//                           <span className="ru-topic-title">{t.title}</span>
//                           <span className="ru-mh-sub" style={{ marginTop: 0 }}>
//                             {resources.length} resource
//                             {resources.length === 1 ? "" : "s"}
//                           </span>
//                         </div>
//                         <div className="ru-progress-bar" style={{ width: 60 }}>
//                           <div
//                             className="ru-progress-fill"
//                             style={{ width: `${topicProgress}%` }}
//                           />
//                         </div>
//                       </div>

//                       {topicOpen && (
//                         <div className="ru-topic-body">
//                           {resources.map((r) => renderResourceRow(r))}
//                           {resources.length === 0 && (
//                             <div
//                               className="ru-mh-sub"
//                               style={{ padding: "10px 0" }}
//                             >
//                               No resources in this topic.
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//                 {topics.length === 0 && (
//                   <div className="ru-mh-sub" style={{ padding: "10px 0" }}>
//                     No topics in this module.
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         );
//       })}

//       {activeQuiz && (
//         <QuizModal
//           title={activeQuiz.title}
//           quizContentJson={activeQuiz.quizContentJson}
//           pending={pendingId === activeQuiz.id}
//           onClose={() => setActiveQuiz(null)}
//           onSubmit={async (score) => {
//             await complete(activeQuiz.id, score);
//             setActiveQuiz(null);
//           }}
//         />
//       )}

//       {activeVideo && (
//         <VideoModal
//           title={activeVideo.title}
//           videoId={activeVideo.sourceUrl}
//           completed={!!activeVideo.completed}
//           pending={pendingId === activeVideo.id}
//           onComplete={async () => {
//             await complete(activeVideo.id);
//           }}
//           onClose={() => setActiveVideo(null)}
//         />
//       )}

//       {activeArticle && (
//         <ArticleModal
//           title={activeArticle.title}
//           contentBody={activeArticle.contentBody}
//           completed={!!activeArticle.completed}
//           pending={pendingId === activeArticle.id}
//           onComplete={async () => {
//             await complete(activeArticle.id);
//           }}
//           onClose={() => setActiveArticle(null)}
//         />
//       )}

//       {activePdf && (
//         <PdfModal
//           resourceId={activePdf.id}
//           title={activePdf.title}
//           completed={!!activePdf.completed}
//           pending={pendingId === activePdf.id}
//           onComplete={async () => {
//             await complete(activePdf.id);
//           }}
//           onClose={() => setActivePdf(null)}
//         />
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import { RESOURCE_ICON } from "./constants";
import QuizModal from "./QuizModal";
import VideoModal from "./VideoModal";
import ArticleModal from "./ArticleModal";
import PdfModal from "./PdfModal";

/**
 * Renders modules[] from a RoadmapUpgradedResponseDto. Each module now
 * contains topics[], and each topic (not the module) carries the actual
 * resources[]:
 *   { id, orderIndex, title, locked, progressPercent, topics: [
 *     { id, orderIndex, title, progressPercent, resources: [
 *       { id, type, title, sourceUrl, filePath, durationOrLength, completed,
 *         quizScore, quizContentJson, contentBody, hasPdf }
 *     ]}
 *   ]}
 *
 * Everything about how an individual resource renders/opens/completes is
 * unchanged from before this topic layer existed - see renderResourceRow()
 * below, which is the exact same logic that used to live inline in the
 * module body, just extracted so it can run once per topic instead of once
 * per module.
 *
 * Props:
 *   modules            - RoadmapUpgradedModuleDto[] (now with topics[])
 *   onCompleteResource - (resourceId, quizScoreOrNull) => Promise
 *   onLockedClick      - (moduleTitle) => void   (e.g. show a toast)
 */
export default function ModuleTree({
  modules,
  onCompleteResource,
  onLockedClick,
}) {
  const [openIndex, setOpenIndex] = useState(() => {
    const firstUnlocked = (modules || []).findIndex((m) => !m.locked);
    return firstUnlocked === -1 ? 0 : firstUnlocked;
  });
  const [openTopics, setOpenTopics] = useState(() => new Set()); // keys: `${moduleIndex}-${topicIndex}`
  const [pendingId, setPendingId] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [activePdf, setActivePdf] = useState(null);

  if (!modules || modules.length === 0) {
    return <div className="ru-empty-state">No modules yet.</div>;
  }

  async function complete(resourceId, quizScore = null) {
    setPendingId(resourceId);
    try {
      await onCompleteResource(resourceId, quizScore);
    } finally {
      setPendingId(null);
    }
  }

  function toggleTopic(key) {
    setOpenTopics((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function renderResourceRow(r) {
    const isDone = !!r.completed;
    const isQuiz = r.type === "QUIZ";
    const isVideo = r.type === "VIDEO";
    const isPlayableVideo = isVideo && !!r.sourceUrl;
    const isArticle = r.type === "ARTICLE";
    const isReadableArticle = isArticle && !!r.contentBody;
    const isPdf = r.type === "PDF";
    const isReadablePdf = isPdf && !!r.hasPdf;
    const isPending = pendingId === r.id;

    let titleContent;
    if (isQuiz && !isDone) {
      titleContent = r.title;
    } else if (isPlayableVideo) {
      titleContent = (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveVideo(r);
          }}
        >
          {r.title}
        </a>
      );
    } else if (isReadableArticle) {
      titleContent = (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveArticle(r);
          }}
        >
          {r.title}
        </a>
      );
    } else if (isReadablePdf) {
      titleContent = (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActivePdf(r);
          }}
        >
          {r.title}
        </a>
      );
    } else if (!isVideo && !isArticle && !isPdf && r.sourceUrl) {
      titleContent = (
        <a href={r.sourceUrl} target="_blank" rel="noreferrer">
          {r.title}
        </a>
      );
    } else if (isVideo) {
      titleContent = (
        <span style={{ color: "var(--ru-muted)" }}>
          {r.title} <em style={{ fontSize: ".78rem" }}>(video unavailable)</em>
        </span>
      );
    } else {
      titleContent = r.title;
    }

    let actionContent;
    if (isDone) {
      if (isPlayableVideo || isReadableArticle || isReadablePdf) {
        actionContent = (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="ru-res-check">✓ DONE</span>
            <button
              className="ru-tool-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (isPlayableVideo) setActiveVideo(r);
                else if (isReadableArticle) setActiveArticle(r);
                else if (isReadablePdf) setActivePdf(r);
              }}
            >
              {isPlayableVideo
                ? "Watch again"
                : isReadableArticle
                  ? "Read again"
                  : "View again"}
            </button>
          </span>
        );
      } else {
        actionContent = <span className="ru-res-check">✓ DONE</span>;
      }
    } else if (isQuiz) {
      actionContent = (
        <button
          className="ru-tool-btn"
          disabled={isPending || !r.quizContentJson}
          onClick={(e) => {
            e.stopPropagation();
            setActiveQuiz(r);
          }}
          title={
            !r.quizContentJson
              ? "Quiz content unavailable for this resource"
              : undefined
          }
        >
          {isPending ? "Saving…" : "Take Quiz"}
        </button>
      );
    } else if (isPlayableVideo) {
      actionContent = (
        <button
          className="ru-tool-btn"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            setActiveVideo(r);
          }}
        >
          {isPending ? "Saving…" : "Watch"}
        </button>
      );
    } else if (isReadableArticle) {
      actionContent = (
        <button
          className="ru-tool-btn"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            setActiveArticle(r);
          }}
        >
          {isPending ? "Saving…" : "Read"}
        </button>
      );
    } else if (isReadablePdf) {
      actionContent = (
        <button
          className="ru-tool-btn"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            setActivePdf(r);
          }}
        >
          {isPending ? "Saving…" : "View"}
        </button>
      );
    } else {
      actionContent = (
        <button
          className="ru-res-check"
          style={{ background: "none", border: "none", cursor: "pointer" }}
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            complete(r.id);
          }}
        >
          {isPending ? "Saving…" : "Mark done"}
        </button>
      );
    }

    return (
      <div key={r.id} className={`ru-res-row${isDone ? " done" : ""}`}>
        <span className="ru-res-icon">{RESOURCE_ICON[r.type] || "•"}</span>
        <span className="ru-res-type">{r.type?.toLowerCase()}</span>
        <span style={{ flex: 1 }}>
          {titleContent}
          {r.durationOrLength && (
            <span
              style={{
                color: "var(--ru-muted)",
                marginLeft: 8,
                fontSize: ".78rem",
              }}
            >
              {r.durationOrLength}
            </span>
          )}
          {isQuiz && isDone && r.quizScore != null && (
            <span
              style={{
                color: "var(--ru-accent)",
                marginLeft: 8,
                fontSize: ".78rem",
                fontWeight: 700,
              }}
            >
              Score: {r.quizScore}%
            </span>
          )}
        </span>

        {actionContent}
      </div>
    );
  }

  return (
    <div>
      {modules.map((m, i) => {
        const isOpen = openIndex === i;
        const isLocked = !!m.locked;
        const progress = m.progressPercent ?? 0;
        const topics = m.topics || [];

        return (
          <div key={m.id ?? i} className={`ru-module${isOpen ? " open" : ""}`}>
            <div
              className="ru-module-head"
              onClick={() =>
                isLocked
                  ? onLockedClick?.(m.title)
                  : setOpenIndex(isOpen ? -1 : i)
              }
            >
              <div className="ru-mh-left">
                <div className={`ru-m-num${isLocked ? " locked" : ""}`}>
                  {isLocked
                    ? "🔒"
                    : progress >= 100
                      ? "✓"
                      : (m.orderIndex ?? i) + 1}
                </div>
                <div>
                  <div className="ru-mh-title">{m.title}</div>
                  <div className="ru-mh-sub">
                    {isLocked
                      ? `Unlocks after Module ${m.orderIndex ?? i}`
                      : `${topics.length} topic${topics.length === 1 ? "" : "s"}`}
                  </div>
                </div>
              </div>
              <div className="ru-progress-bar">
                <div
                  className="ru-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {isOpen && !isLocked && (
              <div className="ru-module-body">
                {topics.map((t, ti) => {
                  const topicKey = `${i}-${ti}`;
                  const topicOpen = openTopics.has(topicKey);
                  const topicProgress = t.progressPercent ?? 0;
                  const resources = t.resources || [];

                  return (
                    <div
                      key={t.id ?? ti}
                      className={`ru-topic${topicOpen ? " open" : ""}`}
                    >
                      <div
                        className="ru-topic-head"
                        onClick={() => toggleTopic(topicKey)}
                      >
                        <div className="ru-topic-left">
                          <span className="ru-topic-caret">
                            {topicOpen ? "▾" : "▸"}
                          </span>
                          <span className="ru-topic-title">{t.title}</span>
                          <span className="ru-mh-sub" style={{ marginTop: 0 }}>
                            {resources.length} resource
                            {resources.length === 1 ? "" : "s"}
                          </span>
                        </div>
                        <div className="ru-progress-bar" style={{ width: 60 }}>
                          <div
                            className="ru-progress-fill"
                            style={{ width: `${topicProgress}%` }}
                          />
                        </div>
                      </div>

                      {topicOpen && (
                        <div className="ru-topic-body">
                          {resources.map((r) => renderResourceRow(r))}
                          {resources.length === 0 && (
                            <div
                              className="ru-mh-sub"
                              style={{ padding: "10px 0" }}
                            >
                              No resources in this topic.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {topics.length === 0 && (
                  <div className="ru-mh-sub" style={{ padding: "10px 0" }}>
                    No topics in this module.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {activeQuiz && (
        <QuizModal
          title={activeQuiz.title}
          quizContentJson={activeQuiz.quizContentJson}
          pending={pendingId === activeQuiz.id}
          onClose={() => setActiveQuiz(null)}
          onSubmit={async (score) => {
            await complete(activeQuiz.id, score);
            setActiveQuiz(null);
          }}
        />
      )}

      {activeVideo && (
        <VideoModal
          title={activeVideo.title}
          videoId={activeVideo.sourceUrl}
          completed={!!activeVideo.completed}
          pending={pendingId === activeVideo.id}
          onComplete={async () => {
            await complete(activeVideo.id);
          }}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {activeArticle && (
        <ArticleModal
          title={activeArticle.title}
          contentBody={activeArticle.contentBody}
          completed={!!activeArticle.completed}
          pending={pendingId === activeArticle.id}
          onComplete={async () => {
            await complete(activeArticle.id);
          }}
          onClose={() => setActiveArticle(null)}
        />
      )}

      {activePdf && (
        <PdfModal
          resourceId={activePdf.id}
          title={activePdf.title}
          completed={!!activePdf.completed}
          pending={pendingId === activePdf.id}
          onComplete={async () => {
            await complete(activePdf.id);
          }}
          onClose={() => setActivePdf(null)}
        />
      )}
    </div>
  );
}
