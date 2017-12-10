import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

Enzyme.configure({ adapter: new Adapter() });

if (process.env.REACT_APP_IS_E2E_TEST) {
  const el = Enzyme.mount(<App />, { attachTo: document.getElementById('root') });
  window.el = el;
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}

registerServiceWorker();
