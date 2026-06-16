import { OrderStatusValue } from '../../domain/value-objects/order-status';
import { TrackedOrder } from '../../domain/repositories/order.repository';
import { OrderTrackingVm } from '../dto/order-tracking.vm';

type TrackingStepDef = {
  key: OrderStatusValue;
  label: string;
  body: string;
};

const TRACKING_STEPS: TrackingStepDef[] = [
  {
    key: 'Placed',
    label: 'Order placed',
    body: 'We got your order and are reviewing it.',
  },
  {
    key: 'Confirmed',
    label: 'Confirmed',
    body: 'Your order is confirmed and queued.',
  },
  {
    key: 'Preparing',
    label: 'Prepping',
    body: 'The kitchen is stretching your dough now.',
  },
  {
    key: 'Baking',
    label: 'In the oven',
    body: 'Your pizza is firing right now.',
  },
  {
    key: 'Ready',
    label: 'Ready',
    body: 'Done. Your order is boxed and ready.',
  },
  {
    key: 'OutForDelivery',
    label: 'Out for delivery',
    body: 'On its way to you.',
  },
  {
    key: 'Delivered',
    label: 'Delivered',
    body: 'Enjoy your meal.',
  },
];

export class OrderTrackingMapper {
  static toVm(order: TrackedOrder): OrderTrackingVm {
    const currentIndex = TRACKING_STEPS.findIndex(
      (step) => step.key === order.status,
    );
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const activeStep = TRACKING_STEPS[safeIndex];

    return {
      orderId: order.orderId,
      statusLabel: activeStep.label,
      statusBody: activeStep.body,
      etaMinutes: order.estimatedMinutes,
      steps: TRACKING_STEPS.map((step, index) => ({
        key: step.key,
        label: step.label,
        body: step.body,
        state:
          index < safeIndex
            ? 'complete'
            : index === safeIndex
              ? 'current'
              : 'upcoming',
      })),
      lines: order.lines.map((line) => ({
        id: line.id,
        name: line.name,
        quantity: line.quantity,
        subtotal: line.subtotal,
        currency: line.currency,
      })),
    };
  }
}
