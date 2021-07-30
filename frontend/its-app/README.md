# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



แก้ API ที่ frontend\its-app\src\services\urlAPI.ts

ในหน้าเพิ่มโรงเรียนหากไม่มี placeholder เป็นตำบล จังหวัด อำเภอให้เปลี่ยนไฟล์ที่ its-app\node_modules\react-thailand-address-typeahead-ponchai\dist\index.js เป็น

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _finder = require('./finder');

var _AddressTypeahead = require('./AddressTypeahead.component');

var _AddressTypeahead2 = _interopRequireDefault(_AddressTypeahead);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddressForm = function (_React$Component) {
  _inherits(AddressForm, _React$Component);

  function AddressForm(props) {
    _classCallCheck(this, AddressForm);

    var _this = _possibleConstructorReturn(this, (AddressForm.__proto__ || Object.getPrototypeOf(AddressForm)).call(this, props));

    _this.state = {
      addressObj: props.values
    };
    _this.setAddressObj = _this.setAddressObj.bind(_this);
    return _this;
  }

  _createClass(AddressForm, [{
    key: 'setAddressObj',
    value: function setAddressObj(addressObj) {
      this.setState({ addressObj: addressObj });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var addressObj = this.state.addressObj;

      return _react2.default.createElement(
        'div',
        null,
        Object.keys(_finder.fieldsEnum).map(function (key) {
          var name = void 0;
          switch (_finder.fieldsEnum[key]) {
            case 'd':
              name = 'ตำบล';break;
            case 'a':
              name = 'อำเภอ';break;
            case 'p':
              name = 'จังหวัด';break;
            case 'z':
              name = 'รหัสไปรษณีย์';break;
            default:
              name = '';break;
          }
          return _react2.default.createElement(
            'div',
            { key: key, className: 'typeahead-address-container' },
            _this2.props.showLabel ? _react2.default.createElement(
              'label',
              { className: 'typeahead-address-label', htmlFor: 'district' },
              name
            ) : _react2.default.createElement('label', null),
            _react2.default.createElement(_AddressTypeahead2.default, {
              className: _this2.props.classNameInput,
              placeholder: _this2.props.placeholder ? _this2.props.placeholder[_finder.fieldsEnum[key]] || '' :propsA(key),
              renderResult: _this2.props.renderResult,
              onOptionSelected: function onOptionSelected(result) {
                _this2.setAddressObj(result);
                _this2.props.onAddressSelected(result);
              },
              value: addressObj ? addressObj[_finder.fieldsEnum[key]] : '',
              fieldType: _finder.fieldsEnum[key]
            })
          );
        })
      );
    }
  }]);
  
  
  function propsA(p){
    var name = '';
    switch (p) {
      case 'DISTRICT':
        name = 'ตำบล';break;
      case 'AMPHOE':
        name = 'อำเภอ';break;
      case 'PROVINCE':
        name = 'จังหวัด';break;
      case 'ZIPCODE':
        name = 'รหัสไปรษณีย์';break;
      default:
        name = '';break;
    }
	  return name
  }
  

  return AddressForm;
}(_react2.default.Component);

exports.default = AddressForm;



