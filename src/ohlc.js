import Rx from 'rxjs/Rx'
//import 'rxjs/add/observable/from'
//import 'rxjs/add/observable/range'
//import 'rxjs/add/observable/zip'
//import 'rxjs/add/operator/toPromise'
//import 'rxjs/add/operator/toArray'
//import 'rxjs/add/operator/map'
//import 'rxjs/add/operator/groupby'
//import 'rxjs/add/operator/mergeMap'
//import 'rxjs/add/operator/reduce'
//import 'rxjs/add/operator/max'
//import 'rxjs/add/operator/min'
//import 'rxjs/add/operator/first'
//import 'rxjs/add/operator/share'

export function aggregate(indexFunc, originalOHLC) {
    const originalDateObservable = Rx.Observable.from(originalOHLC.date)
    const dateWithIndex = Rx.Observable.zip(originalDateObservable, Rx.Observable.range(0, originalData.date.length))
    const groupedKeyDate = dateWithIndex.groupBy((item) => indexFunc(item[0]).getTime()).share()

    const open = groupedKeyDate.flatMap(group => group.reduce((acc, curr) => acc[0] < curr[0] ? acc : curr))
                               .map(item => originalOHLC.open[item[1]])
                               .toArray()

    const close = groupedKeyDate.flatMap(group => group.reduce((acc, curr) => acc[0] > curr[0] ? acc : curr))
                                .map(item => originalData.close[item[1]])
                                .toArray()

    const high = groupedKeyDate.flatMap(group => group.map(item => originalOHLC.high[item[1]]).max())
                               .toArray()

    const low = groupedKeyDate.flatMap(group => group.map(item => originalOHLC.low[item[1]]).min())
                               .toArray()
    
    const keyTime = groupedKeyDate.flatMap(group => group.first().map(item => toMonth(item[0])))
                                  .toArray()

    return Rx.Observable.zip(keyTime, open, high, low, close).map(item => {
        return {
            date: item[0],
            open: item[1],
            high: item[2],
            low: item[3],
            close: item[4]
        }
    }).toPromise()
}

export function toWeek(date) {
    return new Date(date.getTime() - ((date.getDay() - 1) * 86400000))
}

export function toMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function toYear(date) {
    return new Date(date.getFullYear(), 1, 1)
}

