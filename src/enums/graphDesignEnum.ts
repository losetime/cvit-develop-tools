/**
 * @desc 流程图连接桩配置
 */
export const ConnectionPorts = {
  items: [
    {
      group: 'in1',
      id: 'in1',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#B2C0D2',
          fill: '#fff',
          strokeWidth: 1,
        },
      },
    },
    {
      group: 'in2',
      id: 'in2',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#B2C0D2',
          fill: '#fff',
          strokeWidth: 1,
        },
      },
    },
    {
      group: 'out1',
      id: 'out1',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#B2C0D2',
          fill: '#fff',
          strokeWidth: 1,
        },
      },
    },
    {
      group: 'out2',
      id: 'out2',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#B2C0D2',
          fill: '#fff',
          strokeWidth: 1,
        },
      },
    },
  ],
  groups: {
    in1: {
      position: { name: 'right' },
    },
    in2: {
      position: { name: 'top' },
    },
    out1: {
      position: { name: 'left' },
    },
    out2: {
      position: { name: 'bottom' },
    },
  },
}
