import React, { useEffect, useRef, useState } from "react";
import { useStateValue } from "../context/StateProvider";
import SingleContact from "./SingleContact";
import { actionType } from "../context/reducer";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import selectDate from "../utils/selectDate.svg";
import deleteP from "../utils/delete.svg";
import importP from "../utils/import.svg";
import exportP from "../utils/export.svg";
import { motion } from "framer-motion";
import Confirm from "./Confirm";
import SucessDelete from "./SuccessDelete";
import SuccessUpload from "./SuccessUpload";

const AllContact = () => {
  const navigate = useNavigate();
  const [isPop, setIsPop] = useState(false);
  const [conf, setConf] = useState(false);
  const [sucDel, setSucDel] = useState(false);
  const [state, dispatch] = useStateValue();
  const [successUp, setSuccessUp] = useState(false);
  const inputRef = useRef();

  const fetchData = async () => {
    const jsonData = await fetch(process.env.REACT_APP_API + "/contact", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: state.user.token,
      },
    });

    const data = await jsonData.json();
    if (data.status === "sucess") {
      dispatch({
        type: actionType.ADD_CONTACT,
        payload: { contact: data.data },
      });
      dispatch({ type: actionType.SEARCH, payload: { key: "" } });
    } else {
      dispatch({ type: actionType.REMOVE_USER });
      navigate("/");
    }
    // console.log(data.data);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (state.isChecked) {
      inputRef.current.checked = true;
    } else {
      inputRef.current.checked = false;
    }
  });

  const handleDelete = async () => {
    const getRes = await fetch(process.env.REACT_APP_API + "/contact", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: state.user.token,
      },
      body: JSON.stringify(state.mark),
    });

    const response = await getRes.json();
    dispatch({ type: actionType.REMOVE_MARK });
    fetchData();
    setConf(false);

    if (Object.keys(response.data).length) {
      setSucDel(true);
      setTimeout(() => {
        setSucDel(false);
      }, 2000);
    }

    console.log(response);
  };

  return (
    <div className="mainpage">
      <section className="hero">
        <div className="filter">
          <img src={selectDate} alt="selectDate" />

          <div>
            <motion.img
              whileTap={{ scale: 0.75 }}
              src={deleteP}
              alt="delete"
              onClick={() => {
                setConf(!conf);
                setIsPop(false);
              }}
            />

            <motion.img
              whileTap={{ scale: 0.75 }}
              src={importP}
              alt="import"
              onClick={() => {
                setIsPop(!isPop);
                setConf(false);
              }}
            />

            <motion.img whileTap={{ scale: 0.75 }} src={exportP} alt="export" />
          </div>
        </div>

        {successUp ? <SuccessUpload /> : ""}
        {sucDel ? <SucessDelete /> : ""}
        {conf ? <Confirm setConf={setConf} handleDelete={handleDelete} /> : ""}
        {isPop ? (
          <Popup
            fetchData={fetchData}
            setIsPop={setIsPop}
            setSuccessUp={setSuccessUp}
          />
        ) : (
          ""
        )}

        <table>
          <thead>
            <tr>
              <th className="checkboxs">
                <input
                  type="checkbox"
                  ref={inputRef}
                  onClick={() => {
                    dispatch({ type: actionType.CHECKED });
                  }}
                />
              </th>
              <th className="name">Name</th>
              <th className="designation">Designation</th>
              <th className="company">Company</th>
              <th className="industry">Industry</th>
              <th className="email">Email</th>
              <th className="phoneNumber">Phone Number</th>
              <th className="country">Country</th>
              <th className="action">Action</th>
            </tr>
          </thead>
          <tbody>
            {state.filter.map((obj) => (
              <SingleContact
                key={obj._id}
                {...obj}
                fetchData={fetchData}
                setSucDel={setSucDel}
              />
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AllContact;
