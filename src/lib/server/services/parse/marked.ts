// @ts-expect-error Cannot merge declaration here
import { cleanUrl } from '../../../../../node_modules/marked/src/helpers';
// @ts-expect-error Cannot merge declaration here
import { block } from '../../../../../node_modules/marked/src/rules';

declare function cleanUrl(sanitize: boolean, base: string, href: string): string | null;
declare const block: { _tag: string };

export { cleanUrl, block };
