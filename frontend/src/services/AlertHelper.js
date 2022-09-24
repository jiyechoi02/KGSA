export const initialData = {
    success : false,
    fail : false,
    loading : false,
}
export const reducer = (state, action) =>{
    switch (action.type) {
        case 'success':
            return { ...state, success: action.value}
        case 'fail':
            return { ...state, fail: action.value}     
        case 'loading' :
            return { ...state, loading: action.value}       
        default:
            return state;
    }
}