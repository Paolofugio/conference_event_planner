import React from "react";
import "./TotalCost.css";

type TotalCosts = {
  venue: number;
  addOns: number;
  meals: number;
};

type TotalCostProps = {
  totalCosts: TotalCosts;
  ItemsDisplay: React.ComponentType;
};

const TotalCost: React.FC<TotalCostProps> = ({ totalCosts, ItemsDisplay }) => {
  const total_amount = totalCosts.venue + totalCosts.addOns + totalCosts.meals;

  return (
    <div className="pricing-app">
      <div className="display_box">
        <div className="header">
          <h3>Total cost for the event</h3>
        </div>
        <div>
          <h2 id="pre_fee_cost_display" className="price">
            ${total_amount}
          </h2>
          <div>
            <ItemsDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalCost;
