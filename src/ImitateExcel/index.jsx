import { Table, Menu, Button } from 'antd';
import React from 'react';
import styles from './style.less';


export default () => {

  /**
   * 表格操作方案3：鼠标框选选中表格
   */
  let mouseDownIndex = 0;
  let mouseUpIndex = 0;
  let rect;

  // 是否需要(允许)处理鼠标的移动事件,默认识不处理
  let select = false;

  // 记录鼠标按下时的坐标
  let downX = 0;
  let downY = 0;
  // 记录鼠标抬起时候的坐标
  let mouseX2 = downX;
  let mouseY2 = downY;

  //处理鼠标按下事件
  const handleMouseDown = (event, seat, time, index) => {
    if (event.button === 0) {
      // 换列选中，取消之前选中
      if (seat !== mouseDownSeat) {
        let newMonitorList;
        if (mouseDownSeatInitModal) {
          newMonitorList = initRectSelectData(
            monitorList,
            mouseDownSeatInitModal,
          );
        }
        newMonitorList = initRectSelectData(monitorList, mouseDownSeat);
        props.dispatch({
          type: 'monitorListModel/saveListByRected',
          payload: {
            newMonitorList,
          },
        });
        createColum();
      }

      mouseDownIndex = index;
      // setMouseDownSeat(seat);
      mouseDownSeat = seat;

      rect = document.getElementById('rect');
      // 设置默认值,目的是隐藏图层
      rect.style.width = 0 + 'px';
      rect.style.height = 0 + 'px';
      rect.style.visibility = 'hidden';
      //让你要画的图层位于最上层
      rect.style.zIndex = 1000;
      // 鼠标按下时才允许处理鼠标的移动事件
      select = true;

      //让你要画框的那个图层显示出来
      rect.style.visibility = 'visible';
      // 取得鼠标按下时的坐标位置
      downX = event.clientX;
      downY = event.clientY;

      //设置你要画的矩形框的起点位置
      rect.style.left = downX + 'px';
      rect.style.top = downY - 112 + 'px';
    }
  };

  //鼠标抬起事件
  const handleMouseUp = (e, seat, time, index) => {
    if (e.button === 0) {
      mouseUpIndex = index;

      //鼠标抬起,就不允许在处理鼠标移动事件
      select = false;

      //隐藏图层
      rect.style.visibility = 'hidden';

      const newMonitorList = formatRectSelectData(
        monitorList,
        mouseDownSeat,
        mouseDownIndex,
        mouseUpIndex,
      );

      props.dispatch({
        type: 'monitorListModel/saveListByRected',
        payload: {
          newMonitorList,
        },
      });
      createColum();
    }

    // 获取选择后的时间list
    selectedTimeSlot = getSelectedTimeSlot(monitorList);
    childRef.current.setTreeSelectValue(selectedTimeSlot);
    setMouseDownSeatInitModal(mouseDownSeat);
  };

  //鼠标移动事件,最主要的事件
  const handleMouseMove = (event) => {
    /*
     这个部分,根据你鼠标按下的位置,和你拉框时鼠标松开的位置关系,可以把区域分为四个部分,根据四个部分的不同,
     我们可以分别来画框,否则的话,就只能向一个方向画框,也就是点的右下方画框.
     */
    if (select) {
      domDayPlanListDistanceTop = document
        .getElementById('dayPlanList')
        .getBoundingClientRect().y;

      // 取得鼠标移动时的坐标位置
      mouseX2 = event.clientX;
      mouseY2 = event.clientY;

      // 设置拉框的大小
      rect.style.width = Math.abs(mouseX2 - downX) + 'px';
      rect.style.height = Math.abs(mouseY2 - downY) + 'px';
      rect.style.visibility = 'visible';

      // 鼠标左上滑动
      if (mouseX2 < downX && mouseY2 < downY) {
        rect.style.left = mouseX2 + 'px';
        rect.style.top = mouseY2 - domDayPlanListDistanceTop + 'px';
      }
      // 鼠标右上滑动
      if (mouseX2 > downX && mouseY2 < downY) {
        rect.style.left = downX + 'px';
        rect.style.top = mouseY2 - domDayPlanListDistanceTop + 'px';
      }
      // 鼠标左下滑动
      if (mouseX2 < downX && mouseY2 > downY) {
        rect.style.left = mouseX2 + 'px';
        rect.style.top = downY - domDayPlanListDistanceTop + 'px';
      }
      // 鼠标右下滑动
      if (mouseX2 > downX && mouseY2 > downY) {
        rect.style.left = downX + 'px';
        rect.style.top = downY - domDayPlanListDistanceTop + 'px';
      }
    }

    // window.event.cancelBubble = true;
    // window.event.returnValue = false;
  };

  const dataSource = [
    {
      key: '1',
      time: '08:30-09:00',
      '01扇区监控席': '胡彦斌',
    },
    {
      key: '2',
      time: '09:00-10:00',
      '01扇区监控席': '林俊杰',
    },
  ];

  const columns = [
    {
      align: "center",
      fixed: "left",
      dataIndex: "time",
      key: "time",
      title: "时间段",
      width: 50,
    },
    {
      align: "center",
      dataIndex: "01扇区监控席",
      key: "01扇区监控席",
      title: '01扇区监控席',
      width: 80,
    }
  ];

  return (
    <Table
      id="dayPlanList"
      style={{ zIndex: 1 }}
      size="small"
      bordered={true}
      columns={columns}
      rowKey="time"
      dataSource={dataSource}
      // scroll={{ x: 1600, y: useWindowSize().height - headerHeight }}
      pagination={false}
      // rowClassName={(record) => dynamicClassNameByIsTimeLater(record)}
    />
  )
}