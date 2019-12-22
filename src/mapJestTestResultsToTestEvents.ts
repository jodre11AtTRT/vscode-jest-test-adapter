import _ from "lodash";
import { TestEvent } from "vscode-test-adapter-api";
import { mapAssertionResultToTestId } from "./helpers/mapAssertionResultToTestId";
import { mapJestAssertionToTestDecorations } from "./helpers/mapJestAssertionToTestDecorations";
import { IJestResponse } from "./types";

export function mapJestTestResultsToTestEvents(jestResponse: IJestResponse): TestEvent[] {
  return _.flatMap(jestResponse.results.testResults, fileResult =>
    fileResult.assertionResults.map(
      assertionResult =>
        ({
          decorations: mapJestAssertionToTestDecorations(assertionResult, fileResult.name, jestResponse.reconciler),
          message: assertionResult.failureMessages?.length > 0 ? assertionResult.failureMessages.join("\n") : undefined,
          state: assertionResult.status,
          test: mapAssertionResultToTestId(assertionResult, fileResult.name),
          type: "test",
        } as TestEvent),
    ),
  );
}