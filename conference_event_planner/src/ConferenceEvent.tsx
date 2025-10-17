import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrementAvQuantity, incrementAvQuantity } from "./addOnsSlice";
import "./ConferenceEvent.css";
import { toggleMealSelection } from "./mealsSlice";
import TotalCost from "./TotalCost";
import { decrementQuantity, incrementQuantity } from "./venueSlice";
import { RootState, AppDispatch } from "./store"; // Adjust if needed

// Type definitions
interface VenueItem {
  name: string;
  cost: number;
  quantity: number;
  img: string;
}

interface AddOnItem {
  name: string;
  cost: number;
  quantity: number;
  img: string;
}

interface MealItem {
  name: string;
  cost: number;
  selected: boolean;
}

interface Item {
  name: string;
  cost: number;
  quantity?: number;
  numberOfPeople?: number;
  type: "venue" | "addOns" | "meals";
}

const ConferenceEvent: React.FC = () => {
  const [showItems, setShowItems] = useState<boolean>(false);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);

  const venueItems = useSelector((state: RootState) => state.venue as VenueItem[]);
  const addOnsItems = useSelector((state: RootState) => state.addons as AddOnItem[]);
  const mealsItems = useSelector((state: RootState) => state.meals as MealItem[]);
  const dispatch = useDispatch<AppDispatch>();

  const remainingAuditoriumQuantity =
    3 - (venueItems.find((item) => item.name === "Auditorium Hall (Capacity:200)")?.quantity || 0);

  const handleToggleItems = (): void => setShowItems(!showItems);

  const handleAddToCart = (index: number): void => {
    if (
      venueItems[index].name === "Auditorium Hall (Capacity:200)" &&
      venueItems[index].quantity >= 3
    ) {
      return;
    }
    dispatch(incrementQuantity(index));
  };

  const handleRemoveFromCart = (index: number): void => {
    if (venueItems[index].quantity > 0) {
      dispatch(decrementQuantity(index));
    }
  };

  const handleIncrementAvQuantity = (index: number): void => {
    dispatch(incrementAvQuantity(index));
  };

  const handleDecrementAvQuantity = (index: number): void => {
    dispatch(decrementAvQuantity(index));
  };

  const handleMealSelection = (index: number): void => {
    dispatch(toggleMealSelection(index));
  };

  const getItemsFromTotalCost = (): Item[] => {
    const items: Item[] = [];

    venueItems.forEach((el) => {
      if (el.quantity > 0) {
        items.push({
          name: el.name,
          cost: el.cost,
          quantity: el.quantity,
          type: "venue",
        });
      }
    });

    addOnsItems.forEach((el) => {
      if (el.quantity > 0) {
        items.push({
          name: el.name,
          cost: el.cost,
          quantity: el.quantity,
          type: "addOns",
        });
      }
    });

    mealsItems.forEach((el) => {
      if (el.selected && numberOfPeople > 0) {
        items.push({
          name: el.name,
          cost: el.cost,
          numberOfPeople,
          type: "meals",
        });
      }
    });

    return items;
  };

  const items = getItemsFromTotalCost();

  const ItemsDisplay: React.FC<{ items: Item[] }> = ({ items }) => (
    <div className="display_box1">
      {items.length === 0 && <p>No items selected</p>}
      <table className="table_item_data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Unit Cost</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{'$' + item.cost}</td>
              <td>
                {item.type === "meals" || item.numberOfPeople
                  ? `For ${numberOfPeople} people`
                  : item.quantity}
              </td>
              <td>
                {item.type === "meals" || item.numberOfPeople
                  ? item.cost * numberOfPeople
                  : item.cost * (item.quantity ?? 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const calculateTotalCost = (section: "venue" | "addons" | "meals"): number => {
    let totalCost = 0;
    if (section === "venue") {
      venueItems.forEach((item) => (totalCost += item.cost * item.quantity));
    } else if (section === "addons") {
      addOnsItems.forEach((item) => (totalCost += item.cost * item.quantity));
    } else if (section === "meals") {
      mealsItems.forEach((item) => {
        totalCost += item.selected ? item.cost * numberOfPeople : 0;
      });
    }
    return totalCost;
  };

  const venueTotalCost = calculateTotalCost("venue");
  const addOnsTotalCost = calculateTotalCost("addons");
  const mealsTotalCost = calculateTotalCost("meals");

  const totalCosts = {
    venue: venueTotalCost,
    addOns: addOnsTotalCost,
    meals: mealsTotalCost,
  };

  const navigateToProducts = (idType: string): void => {
    if (["#venue", "#addons", "#meals"].includes(idType)) {
      if (!showItems) {
        setShowItems(true);
      }
    }
  };

  return (
    <>
      <nav className="navbar_event_conference">
        <div className="company_logo">Conference Expense Planner</div>
        <div className="left_navbar">
          <div className="nav_links">
            <a href="#venue" onClick={() => navigateToProducts("#venue")}>
              Venue
            </a>
            <a href="#addons" onClick={() => navigateToProducts("#addons")}>
              Add-ons
            </a>
            <a href="#meals" onClick={() => navigateToProducts("#meals")}>
              Meals
            </a>
          </div>
          <button className="details_button" onClick={handleToggleItems}>
            Show Details
          </button>
        </div>
      </nav>

      <div className="main_container">
        {!showItems ? (
          <div className="items-information">
            {/* Venue Section */}
            <div id="venue" className="venue_container container_main">
              <div className="text">
                <h1>Venue Room Selection</h1>
              </div>
              <div className="venue_selection">
                {venueItems.map((item, index) => (
                  <div className="venue_main" key={index}>
                    <div className="img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="text">{item.name}</div>
                    <div>{'$' + item.cost}</div>
                    <div className="button_container">
                      {item.name === "Auditorium Hall (Capacity:200)" ? (
                        <>
                          <button
                            className={
                              item.quantity === 0
                                ? "btn-warning btn-disabled"
                                : "btn-minus btn-warning"
                            }
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            &#8211;
                          </button>
                          <span className="selected_count">
                            {item.quantity > 0 ? item.quantity : "0"}
                          </span>
                          <button
                            className={
                              remainingAuditoriumQuantity === 0
                                ? "btn-success btn-disabled"
                                : "btn-success btn-plus"
                            }
                            onClick={() => handleAddToCart(index)}
                          >
                            &#43;
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={
                              item.quantity === 0
                                ? "btn-warning btn-disabled"
                                : "btn-warning btn-plus"
                            }
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            &#8211;
                          </button>
                          <span className="selected_count">
                            {item.quantity > 0 ? item.quantity : "0"}
                          </span>
                          <button
                            className={
                              item.quantity === 10
                                ? "btn-success btn-disabled"
                                : "btn-success btn-plus"
                            }
                            onClick={() => handleAddToCart(index)}
                          >
                            &#43;
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="total_cost">Total Cost: {'$' + venueTotalCost}</div>
            </div>

            {/* Add-ons Section */}
            <div id="addons" className="venue_container container_main">
              <div className="text">
                <h1>Add-ons Selection</h1>
              </div>
              <div className="addons_selection">
                {addOnsItems.map((item, index) => (
                  <div className="av_data venue_main" key={index}>
                    <div className="img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="text">{item.name}</div>
                    <div>{'$' + item.cost}</div>
                    <div className="addons_btn">
                      <button
                        className="btn-warning"
                        onClick={() => handleDecrementAvQuantity(index)}
                      >
                        &ndash;
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="btn-success"
                        onClick={() => handleIncrementAvQuantity(index)}
                      >
                        &#43;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="total_cost">Total Cost: {'$' + addOnsTotalCost}</div>
            </div>

            {/* Meals Section */}
            <div id="meals" className="venue_container container_main">
              <div className="text">
                <h1>Meals Selection</h1>
              </div>
              <div className="input-container venue_selection">
                <label htmlFor="numberOfPeople">
                  <h3>Number of People:</h3>
                </label>
                <input
                  type="number"
                  className="input_box5"
                  id="numberOfPeople"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                  min={1}
                />
              </div>
              <div className="meal_selection">
                {mealsItems.map((item, index) => (
                  <div className="meal_item" key={index} style={{ padding: 15 }}>
                    <div className="inner">
                      <input
                        type="checkbox"
                        id={`meal_${index}`}
                        checked={item.selected}
                        onChange={() => handleMealSelection(index)}
                      />
                      <label htmlFor={`meal_${index}`}>{item.name}</label>
                    </div>
                    <div className="meal_cost">{'$' + item.cost}</div>
                  </div>
                ))}
              </div>
              <div className="total_cost">Total Cost: {'$' + mealsTotalCost}</div>
            </div>
          </div>
        ) : (
          <div className="total_amount_detail">
            <TotalCost
              totalCosts={totalCosts}
              ItemsDisplay={() => <ItemsDisplay items={items} />}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ConferenceEvent;
