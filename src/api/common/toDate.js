const msToDate=(msN, formatN)=>{
    let ms = msN
    let format = formatN || 'yyyy-MM-dd hh:mm:ss'
    if (!ms) {
        return ''
        // }else if (ms.toString().length === 10) {
        //   ms *= 1000
    }
    const d = new Date(ms)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hour = d.getHours()
    const minute = d.getMinutes()
    const seconds = d.getSeconds()
    const addPrefix = source => (source < 10 ? `0${source}` : source)
    format = format.replace('yyyy', year)
        .replace('MM', addPrefix(month))
        .replace('dd', addPrefix(day))
        .replace('hh', addPrefix(hour))
        .replace('mm', addPrefix(minute))
        .replace('ss', addPrefix(seconds))
    return format
}
export default{
    msToDate
}