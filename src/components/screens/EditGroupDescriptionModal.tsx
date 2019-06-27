import { ApolloError } from "apollo-client";
import { Formik, FormikProps } from "formik";
import hoistNonReactStatics from "hoist-non-react-statics";
import { values } from "lodash";
import * as React from "react";
import { SafeAreaView } from "react-native";
import { Button } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as yup from "yup";

import {
  UPDATE_GROUP_MUTATION,
  UpdateGroupMutation,
  UpdateGroupMutationFn,
  UpdateGroupMutationResult
} from "../../graphql/mutations";
import {
  CURRENT_GROUP_ID_QUERY,
  CurrentGroupIdQuery,
  GROUP_DETAILS_QUERY,
  GroupDetailsQuery,
  GroupDetailsQueryResult
} from "../../graphql/queries";
import { NavigationService } from "../../services";
import { FormErrors, FormField, FormLabel, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";
import { LoadingState } from "../organisms";

interface IEditGroupDescriptionFormFields {
  description: string;
}

interface IEditGroupDescriptionProps {
  groupDetails: GroupDetailsQueryResult;
  updateGroup: UpdateGroupMutationFn;
  updateGroupResult: UpdateGroupMutationResult;
  groupId: string;
}

class EditGroupDescriptionModal extends React.Component<IEditGroupDescriptionProps> {
  public static navigationOptions = {
    title: "Edit group description",
    headerRight: <Button type="clear" title="Cancel" onPress={NavigationService.goBack} />
  };

  private editNameForm?: Formik<IEditGroupDescriptionFormFields> | null;

  public render() {
    const { groupDetails, updateGroupResult } = this.props;
    if (groupDetails.loading || !groupDetails.data) {
      return <LoadingState />;
    }
    return (
      <KeyboardAwareScrollView>
        <Formik
          ref={el => (this.editNameForm = el)}
          initialValues={{ description: groupDetails.data.group!.description || "" }}
          onSubmit={this.handleSubmit}
          validateOnChange={false}
          validationSchema={yup.object().shape({
            description: yup.string().max(500)
          })}
        >
          {(formikBag: FormikProps<IEditGroupDescriptionFormFields>) => (
            <SafeAreaView>
              <FormErrors errors={values(formikBag.errors)} />
              <FormLabel>Group description</FormLabel>
              <FormField
                multiline={true}
                multilineGrow={true}
                onChangeText={formikBag.handleChange("description")}
                value={formikBag.values.description}
              />
              <WobblyButton
                text="Submit"
                isLoading={updateGroupResult.loading}
                intent={Intent.PRIMARY}
                onPress={formikBag.handleSubmit}
              />
            </SafeAreaView>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    );
  }

  private handleSubmit = (vals: IEditGroupDescriptionFormFields) => {
    if (!this.props.groupDetails.data || !this.props.groupDetails.data.group) {
      throw new Error("Attempted to update group before its details have loaded -- this should not happen.");
    }
    this.props
      .updateGroup({
        variables: {
          groupId: this.props.groupId,
          name: this.props.groupDetails.data!.group!.name,
          description: vals.description
        }
      })
      .then(() => {
        NavigationService.goBack();
      })
      .catch((e: ApolloError) => {
        if (e && e.graphQLErrors) {
          this.editNameForm!.setErrors({ description: e.graphQLErrors[0].message });
        }
      });
  };
}

const EnhancedComponent = () => (
  <CurrentGroupIdQuery query={CURRENT_GROUP_ID_QUERY}>
    {currentGroupId => {
      const groupId = currentGroupId.data!.currentGroupId!;
      return (
        <GroupDetailsQuery query={GROUP_DETAILS_QUERY} variables={{ groupId }}>
          {groupDetails => (
            <UpdateGroupMutation mutation={UPDATE_GROUP_MUTATION} variables={{ groupId }}>
              {(updateGroup, updateGroupResult) => (
                <EditGroupDescriptionModal
                  groupDetails={groupDetails}
                  updateGroup={updateGroup}
                  updateGroupResult={updateGroupResult}
                  groupId={groupId}
                />
              )}
            </UpdateGroupMutation>
          )}
        </GroupDetailsQuery>
      );
    }}
  </CurrentGroupIdQuery>
);
export default hoistNonReactStatics(EnhancedComponent, EditGroupDescriptionModal);
