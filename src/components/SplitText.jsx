import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(GSAPSplitText, useGSAP);

const SplitText = ({
  text,
  className = "",
  delay = 40, // ms between each character's start (stagger)
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  tag = "span",
  loop = true,
  loopDelay = 1, // seconds pause before restarting
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (!ref.current || !text) return;
      const el = ref.current;

      let splitter;
      let tl;

      try {
        splitter = new GSAPSplitText(el, {
          type: splitType,
          linesClass: "split-line",
        });
      } catch (error) {
        console.error("Failed to create SplitText:", error);
        return;
      }

      let targets;
      switch (splitType) {
        case "lines":
          targets = splitter.lines;
          break;
        case "words":
          targets = splitter.words;
          break;
        case "words, chars":
          targets = [...splitter.words, ...splitter.chars];
          break;
        default:
          targets = splitter.chars;
      }

      if (!targets || targets.length === 0) {
        console.warn("No targets found for SplitText animation");
        splitter.revert();
        return;
      }

      // Prevent clipping: only 'lines' split needs overflow hidden
      // (to stop a whole line jumping in). chars/words must NOT be
      // clipped or the y-offset start position gets cut off on every repeat.
      el.style.overflow = splitType === "lines" ? "hidden" : "visible";

      gsap.set(targets, {
        display: "inline-block",
        willChange: "transform, opacity",
      });

      tl = gsap.timeline({
        repeat: loop ? -1 : 0,
        repeatDelay: loopDelay,
        repeatRefresh: false,
        onComplete: () => {
          if (!loop) onLetterAnimationComplete?.();
        },
        onRepeat: () => {
          onLetterAnimationComplete?.();
        },
      });

      tl.fromTo(
        targets,
        {
          ...from,
          autoAlpha: from.opacity ?? 0,
          force3D: true,
        },
        {
          ...to,
          autoAlpha: to.opacity ?? 1,
          duration,
          ease,
          force3D: true,
          overwrite: "auto",
          immediateRender: false,
          stagger: {
            each: delay / 1000,
            from: "start",
          },
          onComplete: () => {
            if (!loop) onLetterAnimationComplete?.();
          },
        }
      );

      return () => {
        tl.kill();
        gsap.killTweensOf(targets);
        splitter.revert();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        loop,
        loopDelay,
        JSON.stringify(from),
        JSON.stringify(to),
      ],
      scope: ref,
      revertOnUpdate: true,
    }
  );

  const style = {
    wordWrap: "break-word",
    willChange: "transform, opacity",
    display: "inline-block",
  };

  const classes = `split-parent whitespace-normal ${className}`;

  const Tag = tag;
  return (
    <Tag ref={ref} style={style} className={classes}>
      {text}
    </Tag>
  );
};

export default SplitText;







































