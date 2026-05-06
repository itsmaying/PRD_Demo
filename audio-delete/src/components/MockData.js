export const mockData = Array.from({ length: 50 }, (_, index) => {
  const itemNumber = index + 1;
  const assigned = itemNumber % 4 === 0 || itemNumber % 7 === 0;
  const month = itemNumber % 2 === 0 ? '04' : '03';
  const day = String((itemNumber % 24) + 1).padStart(2, '0');
  const minute = String((itemNumber * 7) % 60).padStart(2, '0');

  return {
    id: String(itemNumber),
    title: itemNumber === 1 ? '新录音' : `客户沟通录音 ${itemNumber}`,
    date: `${month}-${day} 10:${minute}:33`,
    duration: itemNumber % 5 === 0 ? `${itemNumber}m12s` : `${(itemNumber * 3) % 58 + 1}s`,
    status: assigned ? 'assigned' : 'unassigned',
    assigneeName: assigned ? ['小猴子', '李总', '王经理', '陈总'][itemNumber % 4] : undefined,
    tag: itemNumber % 6 === 0 ? 'ASR 转写中' : '处理完成'
  };
});
