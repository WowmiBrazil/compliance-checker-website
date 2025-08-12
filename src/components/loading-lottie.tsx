import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function LoadingLottie() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <DotLottieReact
        src="/lottie/ripple-loading-animation.lottie"
        loop
        autoplay
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "300px",
          maxHeight: "300px",
        }}
      />
      <h2 className="text-xl">
        Checking compliance for your script, hold on...
      </h2>
    </div>
  );
}
