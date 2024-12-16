import { motion } from "framer-motion";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";

import { AlertTriangle, CheckCircle, Package, AlertCircle } from "lucide-react";
// import CategoryDistributionChart from "../../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../../components/products/SalesTrendChart";
import ProductsTable from "../../components/products/ProductsTable";

const ProductsPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Reports" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Reports"
            icon={Package}
            value={1234}
            color="#6366F1"
          />
          <StatCard
            name="Pending Reports"
            icon={AlertTriangle}
            value={50}
            color="#F59E0B"
          />
          <StatCard
            name="Processed"
            icon={CheckCircle}
            value={1024}
            color="#10B981"
          />
          {/* <StatCard
            name="High Priority Reports"
            icon={AlertCircle}
            value={100}
            color="#EF4444"
          /> */}
        </motion.div>

        <ProductsTable />

        {/* CHARTS
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          {/* <SalesTrendChart /> */}
          {/* <CategoryDistributionChart /> */}
        {/* </div> */}
      </main>
    </div>
  );
};
export default ProductsPage;
