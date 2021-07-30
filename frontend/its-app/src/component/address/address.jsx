import AddressFormTypeahead from 'react-thailand-address-typeahead-ponchai';
import './styles.css';
import Box from '@material-ui/core/Box';

const Address = (props) => {
    let { add, addressProps } = props
    console.log(addressProps)
    return (
        <div>
            <Box display="flex" justifyContent="center" m={1} p={1} >
                {/* <Box p={1} >
                    ตำบล

                </Box> */}
                <Box p={1} >
                    {addressProps ?
                        <AddressFormTypeahead
                            onAddressSelected={(addressObject) => add(addressObject)}
                            values={{
                                d: addressProps.d, a: addressProps.a, p: addressProps.p,
                            }}
                        />:
                        <AddressFormTypeahead
                            onAddressSelected={(addressObject) => add(addressObject)}
                        />
                    }
                </Box>
            </Box>
        </div>
    )
}
export default Address
