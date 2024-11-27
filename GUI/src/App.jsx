import { Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Protected from "./components/routes/Protected";
import { TransactionProvider } from "./context/TransactionContext";

function App() {
  
  return ( 
  <Protected>
    <TransactionProvider>
    <Layout>
      <Outlet />
    </Layout>
    </TransactionProvider>
    </Protected>
  );
}

export default App;
