import { Ability } from '@casl/ability'
import { initialAbility } from './config.ts'
import { myStorage } from '@/config/main.ts';

//  Read ability from myStorage
// * Handles auto fetching previous abilities if already logged in user
// ? You can update this if you store user abilities to more secure place
// ! Anyone can update myStorage so be careful and please update this
const userData = JSON.parse(myStorage.getItem('userData'))
const existingAbility = userData ? userData.ability : null

export default new Ability(existingAbility || initialAbility)
