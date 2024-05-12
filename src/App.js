import React, { useState } from "react";
import { Table, Switch, Input } from "antd";
import { dataSource } from "./data";
import "./App.css";

function App() {
  const [filters, setFilters] = useState({});
  const [searchText, setSearchText] = useState("");

  const handleSwitchChange = (checked, value, column) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (checked) {
        updated[column] = { ...updated[column], [value]: true };
      } else {
        if (updated[column]) {
          delete updated[column][value];
          if (Object.keys(updated[column]).length === 0) {
            delete updated[column];
          }
        }
      }
      return updated;
    });
  };

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const applyFilters = () => {
    return dataSource.filter(
      (item) =>
        Object.keys(filters).every((column) =>
          filters[column] ? filters[column][item[column]] : true
        ) &&
        (item?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          item?.mall?.toLowerCase().includes(searchText.toLowerCase()))
    );
  };

  const filteredData = applyFilters();

  const getDynamicColumns = () => {
    return dataSource
      .reduce((acc, item) => {
        const keys = Object.keys(item);
        return keys.length > acc.length ? keys : acc;
      }, [])
      .map((key) => ({
        title: key.charAt(0).toUpperCase() + key.slice(1),
        dataIndex: key,
        key,
      }));
  };

  const renderSwitches = () => {
    return getDynamicColumns()
      .slice(1, 6)
      .reverse()
      .map((col, index) => {
        if (col.dataIndex === "name" || col.dataIndex === "mall") {
          return (
            <Input
              key="search-input"
              placeholder={`Search ${col.title}`}
              value={searchText}
              onChange={handleSearchInputChange}
              style={{ height: "3em", width: "30em", marginTop: "6em" }}
            />
          );
        } else {
          const values = Array.from(
            new Set(dataSource.map((item) => item[col.dataIndex]))
          );
          return (
            <div key={index} style={{ marginRight: "1em" }}>
              <h3>{col.title}</h3>
              <div>
                {values.map((value, i) => {
                  if (value) {
                    return (
                      <p key={i} style={{ textAlign: "left" }}>
                        {value}
                        <Switch
                          style={{ marginLeft: "1em" }}
                          onChange={(e) =>
                            handleSwitchChange(e, value, col.dataIndex)
                          }
                        />
                      </p>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
          );
        }
      });
  };

  return (
    <div className="App">
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {renderSwitches()}
      </div>
      <Table
        dataSource={filteredData}
        columns={getDynamicColumns()}
        defaultChecked={false}
      />
    </div>
  );
}

export default App;
