import { TimePicker } from "antd";
import { Dayjs } from "dayjs";

interface TimeSelectionProps {
  handleTimeChange: (time: Dayjs, timeType: string) => void;
  disabledTime: (current: Dayjs) => any;
  typeTime: string;
  defultTime?: Dayjs;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({
  handleTimeChange,
  disabledTime,
  typeTime,
  defultTime,
}) => {
  return (
    <TimePicker
      format="HH:mm"
      className="w-[150px] border-[#979797] "
      onChange={(time) => handleTimeChange(time, typeTime)}
      minuteStep={30}
      disabledTime={disabledTime}
      showNow={false}
      defaultValue={defultTime}
    />
  );
};

export default TimeSelection;
