import React, { useState } from "react";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import user from "../utils/user.svg";
import { motion } from "framer-motion";

const Header = () => {
  // eslint-disable-next-line
  const [state, dispatch] = useStateValue();
  const [key, setKey] = useState();
  const handleChange = (e) => {
    setKey(e.target.value);
    dispatch({ type: actionType.SEARCH, payload: { key: e.target.value } });
  };

  return (
    <header>
      <ul className="header-ul">
        <motion.li whileTap={{ scale: 0.6 }} className="mainHead">
          Total Contact
        </motion.li>
        <li>
          <input
            type="search"
            placeholder="Search by Email Id ....."
            value={key}
            className="searchBox"
            onChange={handleChange}
          />
        </li>
        <motion.li whileTap={{ scale: 0.6 }} className="userField">
          <img src={user} alt="user" />
          <div>
            <p>
              {state.user.email.split("@")[0][0].toUpperCase() +
                state.user.email.split("@")[0].slice(1).toLowerCase()}
            </p>
            <p className="userType">Normal User</p>
          </div>
        </motion.li>
      </ul>
    </header>
  );
};

export default Header;
