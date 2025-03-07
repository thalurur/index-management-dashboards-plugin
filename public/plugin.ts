/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppMountParameters, CoreSetup, CoreStart, Plugin, PluginInitializerContext } from "../../../src/core/public";
import { IndexManagementPluginSetup } from ".";
import { IndexManagementPluginStart } from ".";
import { actionRepoSingleton } from "./pages/VisualCreatePolicy/utils/helpers";

export class IndexManagementPlugin implements Plugin<IndexManagementPluginSetup, IndexManagementPluginStart> {
  constructor(private readonly initializerContext: PluginInitializerContext) {
    // can retrieve config from initializerContext
  }

  public setup(core: CoreSetup): IndexManagementPluginSetup {
    core.application.register({
      id: "opensearch_index_management_dashboards",
      title: "Index Management",
      order: 7000,
      category: {
        id: "opensearch",
        label: "OpenSearch Plugins",
        order: 2000,
      },
      mount: async (params: AppMountParameters) => {
        const { renderApp } = await import("./index_management_app");
        const [coreStart, depsStart] = await core.getStartServices();
        return renderApp(coreStart, params);
      },
    });
    return {
      registerAction: (actionType, uiActionCtor, defaultAction) => {
        actionRepoSingleton.registerAction(actionType, uiActionCtor, defaultAction);
      },
    };
  }

  public start(core: CoreStart): IndexManagementPluginStart {
    Object.freeze(actionRepoSingleton.repository);
    // After this point, calling registerAction will throw error because "Object is not extensible"
    return {};
  }
}
