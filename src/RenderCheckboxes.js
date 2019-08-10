import React from 'react';

const RenderCheckboxes = ({ elementsArr, checkedObj, elementKey, callback }) => {
  return elementsArr.map(el => (
    <label 
      className='checkbox--label'
      key={`checkbox-${el[elementKey]}`}>
      <input
        type="checkbox"
        checked={checkedObj[el[elementKey]]}
        onChange={() => callback(el) } />
        { el[elementKey] }
    </label>
  ))
}

export default RenderCheckboxes