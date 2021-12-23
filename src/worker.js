import register from 'promise-worker/register'
import { calculateWithPacker } from './calculateWithPacker'

register(calculateWithPacker)
