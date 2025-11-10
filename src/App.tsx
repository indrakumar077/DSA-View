import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import QuestionList from './components/QuestionList'
import Question from './components/Question'
import TwoSumVisualization from './components/Array/Easy/TwoSum/TwoSumVisualization'
import BestTimeToBuySellStockVisualization from './components/Array/Easy/BestTimeToBuySellStock/BestTimeToBuySellStockVisualization'
import ContainsDuplicateVisualization from './components/Array/Easy/ContainsDuplicate/ContainsDuplicateVisualization'

// Dynamic Visualization Router
const VisualizationRouter = () => {
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 1;

  if (questionId === 1) {
    return <TwoSumVisualization />;
  }
  
  if (questionId === 2) {
    return <BestTimeToBuySellStockVisualization />;
  }

  if (questionId === 8) {
    return <ContainsDuplicateVisualization />;
  }

  return <Navigate to="/dashboard/questions" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/questions" element={<QuestionList />} />
        <Route path="/dashboard/questions/:id" element={<Question />} />
        <Route path="/dashboard/questions/:id/visualize" element={<VisualizationRouter />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
