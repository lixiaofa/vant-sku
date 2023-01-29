
import { defineComponent} from 'vue'
// Utils
import { createNamespace } from 'vant/lib/utils';
import { stringToDate, dateToString } from '../utils/time-helper';

// Components
import Popup from 'vant/lib/popup';
import DateTimePicker from 'vant/lib/date-picker';
import Field from 'vant/lib/field';

const [name , t] = createNamespace('sku-datetime-field');


export default defineComponent({
  name,
  props: {
    value: String,
    label: String,
    required: Boolean,
    placeholder: String,
    type: {
      type: String,
      default: 'date',
    },
  },

  data() {
    return {
      showDatePicker: false,
      currentDate: this.type === 'time' ? '' : new Date(),
      minDate: new Date(new Date().getFullYear() - 60, 0, 1),
    };
  },

  watch: {
    value(val) {
      switch (this.type) {
        case 'time':
          this.currentDate = val;
          break;
        case 'date':
        case 'datetime':
          this.currentDate = stringToDate(val) || new Date();
          break;
      }
    },
  },

  computed: {
    title() {
      return t(`title.${this.type}`);
    },
  },

  methods: {
    onClick() {
      this.showDatePicker = true;
    },
    onConfirm(val) {
      let data = val;
      if (this.type !== 'time') {
        data = dateToString(val, this.type);
      }
      this.$emit('input', data);
      this.showDatePicker = false;
    },
    onCancel() {
      this.showDatePicker = false;
    },
    formatter(type, val) {
      const word = t(`format.${type}`);
      return `${val}${word}`;
    },
  },

  render() {
    return (
      <Field
        readonly
        is-link
        center
        value={this.value}
        label={this.label}
        required={this.required}
        placeholder={this.placeholder}
        onClick={this.onClick}
      >
        <Popup
          vModel={this.showDatePicker}
          round
          slot="extra"
          position="bottom"
          getContainer="body"
        >
          <DateTimePicker
            type={this.type}
            title={this.title}
            value={this.currentDate}
            minDate={this.minDate}
            formatter={this.formatter}
            onCancel={this.onCancel}
            onConfirm={this.onConfirm}
          />
        </Popup>
      </Field>
    );
  },
});
