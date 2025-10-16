import MainPage from './pages/MainPage';

type AppProps = {
  offersCount: number;
};

export default function App({ offersCount }: AppProps) {
  return <MainPage offersCount={offersCount} />;
}
