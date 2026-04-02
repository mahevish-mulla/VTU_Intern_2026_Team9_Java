import React, { useState } from "react";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const addGoal = () => {
    if (!goalName || !targetAmount) return;

    const newGoal = {
      id: Date.now(),
      goalName: goalName,
      targetAmount: targetAmount,
      savedAmount: 0
    };

    setGoals([...goals, newGoal]);
    setGoalName("");
    setTargetAmount("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Goals Feature</h2>

      <input
        type="text"
        placeholder="Enter Goal (e.g., Buy Car)"
        value={goalName}
        onChange={(e) => setGoalName(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Target Amount"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={addGoal}>Add Goal</button>

      <h3>Your Goals</h3>

      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>
            {goal.goalName} - ₹{goal.targetAmount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Goals;
