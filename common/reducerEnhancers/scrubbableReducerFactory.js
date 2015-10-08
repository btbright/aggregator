import scrubbable from './scrubbable'
import deltable from './deltable'

export default function scrubbableReducerFactory(reducers){
	return Object.keys(reducers).reduce((returnObject, reducerKey) => {
		returnObject[reducerKey] = scrubbable(deltable(reducers[reducerKey]), { namespace : reducerKey });
		return returnObject;
	},{});
}