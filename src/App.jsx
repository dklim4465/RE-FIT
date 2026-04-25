import AppRouter from "./router/AppRouter";
import ScrollToTopButton from "./components/common/ScrollToTopButton";
import FitBot from "./components/chatbot/FitBot"
const SCROLL_TOP_THRESHOLD = 100;

export default function App() {
  return (
    <>
      <AppRouter />
      <ScrollToTopButton threshold={SCROLL_TOP_THRESHOLD} />
      <FitBot />
    </>
  );
}
