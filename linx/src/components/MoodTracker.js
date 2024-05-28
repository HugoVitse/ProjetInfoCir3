import React, { Fragment, useState } from "react";
import { createRoot } from "react-dom/client";
import { AgChartsReact } from "ag-charts-react";
import "ag-charts-enterprise";
import deepClone from "deepclone";

const MoodTracker = () => {
    const getData = () => {
        // Ici, vous pouvez définir la logique pour récupérer les données nécessaires
        // pour initialiser votre graphique ou votre tableau de bord.
        // Par exemple, vous pourriez avoir un objet contenant des données de test.
        return {
          departments: ["Department A", "Department B", "Department C"],
          quality: [8, 6, 7],
          efficiency: [7, 8, 6],
        };
      };

  const [options, setOptions] = useState({
    data: getData(),
    title: {
      text: "KPIs by Department",
    },
    series: [
      {
        type: "radar-area",
        angleKey: "department",
        radiusKey: "quality",
        radiusName: "Quality",
      },
      {
        type: "radar-area",
        angleKey: "department",
        radiusKey: "efficiency",
        radiusName: "Efficiency",
      },
    ],
  });

  const [formData, setFormData] = useState({
    sleepQuality: null,
    stressLevel: null,
    energyLevel: null,
    socialInteraction: "",
    additionalActivity: "",
  });

  const handleSliderChange = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData); // Just for testing purposes, replace with your submission logic
  };

  return (
    <Fragment>
      <div className="mood-tracker-form">
        <h3>How do you feel today?</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="sleepQuality">Sleep Quality (0-10)</label>
            <input
              type="range"
              className="form-range"
              id="sleepQuality"
              name="sleepQuality"
              min="0"
              max="10"
              value={formData.sleepQuality}
              onChange={(e) => handleSliderChange(e.target.value, "sleepQuality")}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="stressLevel">Stress Level (0-10)</label>
            <input
              type="range"
              className="form-range"
              id="stressLevel"
              name="stressLevel"
              min="0"
              max="10"
              value={formData.stressLevel}
              onChange={(e) => handleSliderChange(e.target.value, "stressLevel")}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="energyLevel">Energy Level (0-10)</label>
            <input
              type="range"
              className="form-range"
              id="energyLevel"
              name="energyLevel"
              min="0"
              max="10"
              value={formData.energyLevel}
              onChange={(e) => handleSliderChange(e.target.value, "energyLevel")}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="socialInteraction">Social Interaction</label>
            <textarea
              className="form-control"
              id="socialInteraction"
              name="socialInteraction"
              rows="3"
              value={formData.socialInteraction}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="additionalActivity">Additional Activities</label>
            <input
              type="text"
              className="form-control"
              id="additionalActivity"
              name="additionalActivity"
              value={formData.additionalActivity}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
      <div className="mood-tracker-chart">
        <AgChartsReact options={options} />
      </div>
    </Fragment>
  );
};

export default MoodTracker;
