import React from 'react';
export default function PlansDashboard({ onPlanSelected }) {
  // ... fetch plans etc.

  return (
    <table>
      <tbody>
        {plans.map((plan) => (
          <tr key={plan.id}>
            {/* other cells */}
            <td>
              <button
                onClick={() => onPlanSelected && onPlanSelected(plan)}
              >
                Select / Buy
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
