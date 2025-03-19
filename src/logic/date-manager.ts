
export default function compareDates(first : any, last: any){
    // return new Date(first).toISOString().split('T')[0] == new Date(last).toISOString().split('T')[0]
    return new Date(first).getTime() == new Date(last).getTime()
}