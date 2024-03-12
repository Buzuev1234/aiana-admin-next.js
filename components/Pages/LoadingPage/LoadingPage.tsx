import Media from "@/shared/Media"

const LoadingPage = () => (
  <div
    className="relative flex h-screen w-screen items-center justify-center
        bg-[url('/images/Loading/bg.png')] bg-cover pr-[40px]"
  >
    <Media
      type="image"
      link="/images/logo_big.png"
      blurLink="/images/seo-logo.png"
      containerClasses="w-[300px] aspect-[918/405] relative z-[5]"
    />
    <div
      className="absolute left-0 top-0 z-[2] size-full
            bg-[#121211e6]"
    />
  </div>
)

export default LoadingPage
