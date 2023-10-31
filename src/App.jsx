import axios from "axios";
import { useReducer, useEffect, useState } from "react";

const initialState = {
  currencies: [],
  selectedCurrency: "USD",
  selectedCurrencyRate: "USD",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENCIES":
      return { ...state, currencies: action.payload };
    case "SET_SELECTED_CURRENCY":
      return { ...state, selectedCurrency: action.payload };
    case "SET_SELECTED_CURRENCY_RATE":
      return { ...state, selectedCurrencyRate: action.payload };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_k0PX9ITW3DKQnnAjxJh6Ll2Bmqg3qR3boRIR7zKA&currencies=&base_currency=${state.selectedCurrency}`
        );
        dispatch({ type: "SET_CURRENCIES", payload: response?.data.data });
        dispatch({
          type: "SET_SELECTED_CURRENCY_RATE",
          payload: state.selectedCurrency,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [state.selectedCurrency]);

  const handleChange = (event) => {
    const newSelectedCurrency = event.target.value;
    dispatch({ type: "SET_SELECTED_CURRENCY", payload: newSelectedCurrency });
  };

  useEffect(() => {
    const userInputNumber = parseFloat(userInput);
    const selectedCurrencyRate = state.currencies[state.selectedCurrencyRate];
    const result = userInputNumber * selectedCurrencyRate;

    setResult(result);
  }, [state.currencies, state.selectedCurrencyRate, userInput]);

  console.log(state);

  return (
    <div className="container">
      <h2>currency conversion</h2>

      <div className="conversion">
        <input
          type="number"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <select onChange={handleChange} value={state.selectedCurrency}>
          {Object.keys(state.currencies).map((currencyCode) => (
            <option key={currencyCode} value={currencyCode}>
              {currencyCode}
            </option>
          ))}
        </select>{" "}
        <br />
      </div>
      <div className="conversion">
        <input type="number" value={result ? result : undefined} />
        <select
          value={state.selectedCurrencyRate}
          onChange={(e) =>
            dispatch({
              type: "SET_SELECTED_CURRENCY_RATE",
              payload: e.target.value,
            })
          }
        >
          {Object.keys(state.currencies).map((currencyCode) => (
            <option key={currencyCode} value={currencyCode}>
              {currencyCode}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default App;
