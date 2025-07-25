import { navigationRef } from './RootNavigator';

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function resetStack(name, params) {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name, params }],
  });
}