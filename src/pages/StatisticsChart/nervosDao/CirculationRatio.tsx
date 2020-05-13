import React, { useEffect } from 'react'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { getStatisticCirculationRatio } from '../../../service/app/charts/nervosDao'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage } from '../common/ChartComp'
import { PageActions, AppDispatch } from '../../../contexts/providers/reducer'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '3%',
  right: '3%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (statisticCirculationRatios: State.StatisticCirculationRatio[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) =>
          `<span style="width:${currentLanguage() === 'en' ? '250px' : '165px'};display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
          dataList[0].name,
        )}</div>`
        if (dataList[0].data) {
          result += `<div>${colorSpan(ChartColors[0])}${widthSpan(i18n.t('statistic.circulation_ratio'))} ${
            dataList[0].data
          }%</div>`
        }
        return result
      },
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: '30',
        type: 'category',
        boundaryGap: false,
        data: statisticCirculationRatios.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.circulation_ratio'),
        nameTextStyle: {
          align: 'left',
        },
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${value}%`,
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.circulation_ratio'),
        type: 'line',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticCirculationRatios.map(data => (Number(data.circulationRatio) * 100).toFixed(2)),
      },
    ],
  }
}

export const CirculationRatioChart = ({
  statisticCirculationRatios,
  isThumbnail = false,
}: {
  statisticCirculationRatios: State.StatisticCirculationRatio[]
  isThumbnail?: boolean
}) => {
  if (!statisticCirculationRatios || statisticCirculationRatios.length === 0) {
    return <ChartLoading show={statisticCirculationRatios === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticCirculationRatios, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticCirculationRatio = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticCirculationRatio,
    payload: {
      statisticCirculationRatios: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticCirculationRatios } = useAppState()

  useEffect(() => {
    initStatisticCirculationRatio(dispatch)
    getStatisticCirculationRatio(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.circulation_ratio')}>
      <CirculationRatioChart statisticCirculationRatios={statisticCirculationRatios} />
    </ChartPage>
  )
}
