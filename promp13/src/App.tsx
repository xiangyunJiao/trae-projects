import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Alphabet from '@/pages/Alphabet';
import Words from '@/pages/Words';
import WordsCategory from '@/pages/WordsCategory';
import Sentences from '@/pages/Sentences';
import SentencesCategory from '@/pages/SentencesCategory';
import Stories from '@/pages/Stories';
import StoryDetail from '@/pages/StoryDetail';
import Favorites from '@/pages/Favorites';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alphabet" element={<Alphabet />} />
        <Route path="/words" element={<Words />} />
        <Route path="/words/:category" element={<WordsCategory />} />
        <Route path="/sentences" element={<Sentences />} />
        <Route path="/sentences/:category" element={<SentencesCategory />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:id" element={<StoryDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
